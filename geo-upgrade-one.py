#!/usr/bin/env python3
"""
GEO Post Upgrader for exoticrentalsmontreal.com (Sept 2026)

Daily cron: upgrade ONE blog post to GEO-ready (AI-citable for ChatGPT,
Perplexity, Google AI Overviews). The daily generator (hermes-seo-blog.py)
already produces GEO-shaped NEW posts; this script retrofits the ~286
existing posts that predate the GEO structure.

GEO-ready criteria (per autonomous-businesses / geo-optimizer skills):
  - FAQ section (FAQ / Foire Aux Questions / Questions frequentes)
  - At least one question-based ## heading
  - Direct-answer first paragraph with a hard number
  - 800+ words

Per run: pick the OLDEST post failing the criteria, upgrade it via LLM,
validate, backup, write back, commit, deploy, promote domains.

Usage:
  python3 geo-upgrade-one.py            # upgrade + deploy
  python3 geo-upgrade-one.py --dry-run  # pick + show plan, no LLM call
  python3 geo-upgrade-one.py --check    # print GEO-readiness stats only
"""

import os
import re
import sys
import json
import subprocess
from pathlib import Path
from datetime import date

import urllib.request

sys.path.insert(0, str(Path(__file__).parent))
from hermes_blog_lib import (
    REPO, SITE, get_existing_slugs, DAILY_MODEL, get_api_key,
)

DRY_RUN = "--dry-run" in sys.argv
CHECK_ONLY = "--check" in sys.argv
# GUP_NO_DEPLOY=1: do everything except commit/push/deploy (test mode)
NO_DEPLOY = os.environ.get("GUP_NO_DEPLOY") == "1"
BLOG_FILE = REPO / "lib" / "blog-posts.ts"
BACKUP_FILE = REPO / "lib" / "blog-posts.ts.bak-geo"

API_URL = "https://ollama.com/v1/chat/completions"

FAQ_RE = re.compile(r"(FAQ|Foire [Aa]ux [Qq]uestions|Questions [Ff]requentes)", re.IGNORECASE)
Q_HEADINGS_RE = re.compile(r"(##|<h2>?)\s*(How|What|Where|Can|Is|Do|Why|When|Which|Pourquoi|Comment|Combien|Quels?|Est-ce|Peut-on|Y a)", re.IGNORECASE)
EMDASH_RE = re.compile(r"\u2014|\u2013")  # em dash / en dash — banned in published text

def parse_posts(src: str):
    """Yield (start, end, meta) for each post block in BLOG_POSTS array."""
    # Blocks are delimited by top-level "  {" ... "  }," inside BLOG_POSTS
    starts = [m.start() for m in re.finditer(r"\n  \{", src)]
    ends = []
    for s in starts:
        # find the matching closing "  }," via brace depth from s
        depth = 0
        i = s
        in_tpl = False  # template literal depth guard is crude but content has no ` chars
        while i < len(src):
            ch = src[i]
            if ch == "`":
                in_tpl = not in_tpl
            elif not in_tpl:
                if ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        ends.append(i + 1)
                        break
            i += 1
        else:
            ends.append(len(src))
    out = []
    for s, e in zip(starts, ends):
        block = src[s:e]
        slug_m = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", block)
        if not slug_m:
            continue
        # Two content formats coexist: template literals (content: `...`) and
        # double-quoted escaped strings (content: "...\n...") from the WP migration.
        content_m = re.search(r"content: `([^`]*)`", block, re.DOTALL)
        if content_m:
            content = content_m.group(1)
        else:
            q_m = re.search(r'content: "((?:[^"\\]|\\.)*)"', block, re.DOTALL)
            if q_m:
                raw = q_m.group(1)
                # unescape \n and \" only — full unicode_escape chokes on \uXXXX
                # truncation and mangles UTF-8 (é, à) as raw bytes.
                content = raw.replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t")
            else:
                content = ""
        out.append({
            "start": s, "end": e, "block": block,
            "slug": slug_m.group(1),
            "content": content,
        })
    return out

def geo_score(content: str) -> dict:
    """Return GEO readiness flags for one post."""
    words = len(content.split())
    return {
        "words": words,
        "faq": bool(FAQ_RE.search(content)),
        "q_headings": bool(Q_HEADINGS_RE.search(content)),
        "direct_answer": _has_direct_answer(content),
        "ready": words >= 800 and FAQ_RE.search(content) and Q_HEADINGS_RE.search(content),
    }

def _has_direct_answer(content: str) -> bool:
    """First paragraph carries a hard number (price/HP/age/year)."""
    first_para = content.split("\n\n")[0] if "\n\n" in content else content[:400]
    return bool(re.search(r"\$\d[\d,]*|\d{2,}\s?(hp|ch|km/h|km|km/h)", first_para, re.IGNORECASE))

def md_to_html(md: str) -> str:
    """Markdown → raw HTML (the repo's convention for blog content; the
    renderer passes raw HTML through untouched and the verifier flags literal
    '## ' in content). Mirrors the conversions in app/blog/[slug]/page.tsx."""
    html = md
    html = re.sub(r"^## (.+)$", r"<h2>\1</h2>", html, flags=re.MULTILINE)
    html = re.sub(r"^### (.+)$", r"<h3>\1</h3>", html, flags=re.MULTILINE)
    html = re.sub(r"^- (.+)$", r"<li>\1</li>", html, flags=re.MULTILINE)
    html = re.sub(r"(<li>.*?</li>\n?)+", lambda m: "<ul>" + m.group(0) + "</ul>", html, flags=re.DOTALL)
    html = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", html)
    html = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', html)
    # wrap loose text blocks in <p>
    blocks = re.split(r"\n{2,}", html)
    out = []
    for b in blocks:
        t = b.strip()
        if not t:
            continue
        if re.match(r"^<(h2|h3|ul|ol|p|div|blockquote)", t):
            out.append(t)
        else:
            out.append("<p>" + t.replace("\n", " ") + "</p>")
    return "\n".join(out)


SYSTEM_PROMPT = """You are the GEO editor for Exotic Rentals Montreal (exoticrentalsmontreal.com), an exotic car rental company in Montreal by Gestion Exotics Inc.

Your job: rewrite ONE existing blog post so AI search engines (ChatGPT, Perplexity, Google AI Overviews) cite it.

BANNED PHRASES (never use): "in today's fast-paced world", "whether you're a seasoned pro or a first-timer", "imagine this", "it's no secret that", "elevate your experience", "seamless", "unforgettable", "unparalleled", "look no further", "dive into", "game-changer", "when it comes to", "nestled", "vibrant".

HARD RULES:
- NEVER use em dashes or en dashes. Use commas, periods, or colons.
- Keep every price, car name, phone number, and link from the original. NEVER invent a car, a price, or a spec.
- Keep the same language as the original post (English or Quebec French).
- Keep internal links in their markdown form [text](/path). Do not add new links.
- Do NOT use markdown bold. Only ## and ### headings, lists with "- ", paragraphs, and [text](/path) links.

GEO STRUCTURE (follow exactly):
1. First sentence: a direct 40 to 60 word answer to the main search query, containing one hard number from the original post. No preamble, no hook.
2. 4 to 6 sections with ## question-based headings that mirror real search queries (example: "## How Much Does It Cost to Rent a Lamborghini in Montreal?"). Answer first in 2 to 3 sentences after each heading, then the supporting detail.
3. One specific data point (price, HP, 0-100 time, deposit, age rule) roughly every 150 words.
4. End with "## FAQ" (French: "## Questions frequentes") with 4 to 5 questions as ### headings, each answered in 2 to 3 standalone sentences that make sense without the question.
5. Keep the final booking CTA paragraph (phone, WhatsApp) if the original has one, as the last paragraph.

LENGTH: 800 to 1400 words. The original's key facts must all survive.

Output ONLY valid JSON: {"content": "the full rewritten post in markdown"}
No thinking, no analysis, no code fences. Start with { and end with }."""

def call_llm(system_prompt: str, user_msg: str, max_tokens: int = 28000) -> str | None:
    payload = {
        "model": DAILY_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_msg},
        ],
        "temperature": 0.4,
        "max_tokens": max_tokens,
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {get_api_key()}",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=240) as resp:
            data = json.loads(resp.read().decode())
        content = data["choices"][0]["message"].get("content", "")
        return content if content.strip() else None
    except Exception as e:
        print(f"  API error: {e}")
        return None

def extract_json(raw: str):
    start = raw.find("{")
    if start == -1:
        return None
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(raw)):
        ch = raw[i]
        if esc:
            esc = False
            continue
        if ch == "\\" and in_str:
            esc = True
            continue
        if ch == '"' and not esc:
            in_str = not in_str
            continue
        if in_str:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                candidate = raw[start:i + 1]
                try:
                    return json.loads(candidate)
                except json.JSONDecodeError:
                    # Unescaped newlines inside strings (common in GLM output):
                    # the string-state tracker above treats them as structural
                    # because a raw \n breaks JSON. Retry: newline-scrub first.
                    scrubbed = re.sub(r"(?<!\\)\n", "\\n", candidate)
                    try:
                        return json.loads(scrubbed)
                    except json.JSONDecodeError:
                        # content strings may contain raw { } from template
                        # literals — but then depth never returns to 0. Fall
                        # through and try the LAST balanced close instead.
                        pass
    # Fallback: last '}' — GLM sometimes wraps the JSON in prose or trailing
    # text; find the final balanced object ending at the last '}' in the raw.
    end = raw.rfind("}")
    if end > start:
        candidate = raw[start:end + 1]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            try:
                return json.loads(re.sub(r"(?<!\\)\n", "\\n", candidate))
            except json.JSONDecodeError:
                return None
    return None

def main():
    src = BLOG_FILE.read_text()
    posts = parse_posts(src)
    print(f"Parsed {len(posts)} posts")

    # Stats + candidate list (oldest first: parse order in file is oldest→newest)
    not_ready = []
    stats = {"ready": 0, "faq": 0, "qh": 0, "too_short": 0}
    for i, p in enumerate(posts):
        sc = geo_score(p["content"])
        if sc["faq"]:
            stats["faq"] += 1
        if sc["q_headings"]:
            stats["qh"] += 1
        if sc["ready"]:
            stats["ready"] += 1
        else:
            not_ready.append((i, p, sc))
        if sc["words"] < 800:
            stats["too_short"] += 1

    print(f"GEO-ready: {stats['ready']}/{len(posts)} | FAQ: {stats['faq']} | question-headings: {stats['qh']} | <800w: {stats['too_short']}")
    print(f"Posts to upgrade: {len(not_ready)}")

    if CHECK_ONLY:
        return
    if not not_ready:
        print("ALL POSTS GEO-READY — nothing to do.")
        return

    # Oldest post first (file order: oldest at the bottom? check first slug date)
    # Posts are prepended newest-first in this repo; oldest = last in array.
    idx, post, sc = not_ready[-1]
    print(f"\nTarget: {post['slug']} (words={sc['words']}, faq={sc['faq']}, qh={sc['q_headings']})")

    if DRY_RUN:
        print("DRY RUN — no LLM call, no write.")
        return

    # Backup once per run before any modification. NOTE: rename-based backup
    # means BLOG_FILE does not exist between rename and the final write — any
    # abort path MUST restore it (see _restore helper) before exiting.
    BLOG_FILE.rename(BACKUP_FILE)
    src = BACKUP_FILE.read_text()
    posts = parse_posts(src)
    post = [p for p in posts if p["slug"] == post["slug"]][0]

    def _restore():
        if BACKUP_FILE.exists():
            BACKUP_FILE.rename(BLOG_FILE)

    user_msg = (
        f"Rewrite this post to the GEO structure. Keep every fact, price, car and link.\n\n"
        f"TITLE: (unchanged)\n\n"
        f"CONTENT:\n{post['content']}"
    )
    print("Calling LLM...")
    raw = call_llm(SYSTEM_PROMPT, user_msg)
    if not raw:
        print("LLM returned empty — restoring, aborting.")
        _restore()
        sys.exit(1)

    data = extract_json(raw)
    if not data or "content" not in data:
        print("JSON extraction failed — restoring, aborting.")
        _restore()
        sys.exit(1)

    new_content = data["content"]
    # Convert to raw HTML — the repo convention (verifier ERRORs on literal '## ').
    new_content = md_to_html(new_content)
    new_sc = geo_score(new_content)
    # Validation: GEO criteria + no em dashes + no reasoning leak
    problems = []
    if new_sc["words"] < 600:
        problems.append(f"too short: {new_sc['words']}w")
    if not new_sc["faq"]:
        problems.append("no FAQ")
    if not new_sc["q_headings"]:
        problems.append("no question headings")
    if EMDASH_RE.search(new_content):
        problems.append("em/en dash present")
    if re.search(r"^\d\.\s*\*\*Analyze|^\*\*Goal\*\*", new_content, re.MULTILINE):
        problems.append("reasoning leak")
    if problems:
        print(f"VALIDATION FAILED ({', '.join(problems)}) — restoring, aborting.")
        _restore()
        sys.exit(1)

    print(f"Upgrade OK: {sc['words']}w → {new_sc['words']}w, faq={new_sc['faq']}, qh={new_sc['q_headings']}")

    # Write back: locate the content field INSIDE the target block and splice a
    # fresh template literal. Works for both legacy formats (backtick and
    # double-quoted escaped) — the block is re-emitted as a clean TS object.
    src2 = BACKUP_FILE.read_text()
    posts2 = parse_posts(src2)
    target = [p for p in posts2 if p["slug"] == post["slug"]][0]
    block = src2[target["start"]:target["end"]]
    # find the content field in the block: `content: ` then ` or "
    cm = re.search(r"content: (`|\")", block)
    if not cm:
        print("Content field not found — restoring, aborting.")
        _restore()
        sys.exit(1)
    content_field_start = cm.start()
    if cm.group(1) == "`":
        # template literal: ends at the next unescaped backtick (none escape here)
        end_m = re.search(r"`", block[cm.end():])
        content_field_end = cm.end() + end_m.end()
    else:
        # double-quoted: ends at the closing quote (scan escapes)
        i = cm.end()
        while i < len(block):
            if block[i] == "\\":
                i += 2
                continue
            if block[i] == '"':
                break
            i += 1
        content_field_end = i + 1

    escaped_new = new_content.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    new_field = "content: `" + escaped_new + "`"
    new_block = block[:content_field_start] + new_field + block[content_field_end:]
    src2 = src2[:target["start"]] + new_block + src2[target["end"]:]
    BLOG_FILE.write_text(src2)
    BACKUP_FILE.unlink()

    # verify + deploy — the verifier lives in the autonomous-businesses skill
    # scripts dir (canonical home); ERM's repo scripts/ doesn't carry a copy.
    # The verifier scans the WHOLE file and pre-existing errors (12 markdown
    # posts from Sep 12-24) are not ours to fix in this run — only fail on
    # errors mentioning OUR slug.
    verifier = Path.home() / ".hermes/skills/software-development/autonomous-businesses/scripts/verify-blog-posts.mjs"
    if verifier.exists():
        r = subprocess.run(["node", str(verifier), str(BLOG_FILE)], capture_output=True, text=True, timeout=120)
        our_errors = [l for l in (r.stdout or "").splitlines() if post["slug"] in l and "ERROR" in l]
        if r.returncode != 0 and our_errors:
            print(f"verify-blog-posts flagged OUR post:\n" + "\n".join(our_errors[:5]))
            print("RESTORING from git HEAD, aborting deploy.")
            subprocess.run(["git", "-C", str(REPO), "checkout", "--", str(BLOG_FILE)], check=False)
            sys.exit(1)
        if r.returncode != 0:
            # pre-existing errors elsewhere in the file — note and continue
            err_count = len([l for l in (r.stdout or "").splitlines() if "ERROR" in l])
            print(f"NOTE: {err_count} pre-existing verifier errors in other posts (not ours) — continuing.")

    if NO_DEPLOY:
        print("GUP_NO_DEPLOY=1 — skipping commit/deploy. Diff left in working tree.")
        return

    deploy(f"GEO: upgrade '{post['slug']}'")

def deploy(commit_msg: str) -> None:
    import urllib.error
    os.chdir(REPO)
    subprocess.run(["git", "add", "-A"], check=True)
    subprocess.run(["git", "commit", "-m", commit_msg], check=True)
    subprocess.run(["git", "pull", "--rebase", "origin", "main"], check=True)
    subprocess.run(["git", "push", "origin", "main"], check=True)

    result = subprocess.run(["vercel", "--prod"], capture_output=True, text=True, timeout=300)
    print(result.stdout[-200:] if len(result.stdout) > 200 else result.stdout)

    auth_file = Path("/Users/pogod/Library/Application Support/com.vercel.cli/auth.json")
    auth_data = json.loads(auth_file.read_text())
    token = auth_data["token"]
    repo_json = json.loads((REPO / ".vercel" / "repo.json").read_text())
    project_id = repo_json["projects"][0]["id"]

    url = f"https://api.vercel.com/v6/deployments?projectId={project_id}&limit=1"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        deployments = json.loads(resp.read().decode())
    deploy_uid = deployments["deployments"][0]["uid"]

    for domain in [SITE, f"www.{SITE}"]:
        data = json.dumps({"alias": domain}).encode()
        req = urllib.request.Request(
            f"https://api.vercel.com/v13/deployments/{deploy_uid}/aliases",
            data=data,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                print(f"Promoted to {domain}")
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"Promote {domain}: {e.code} {body[:200]}")

if __name__ == "__main__":
    main()