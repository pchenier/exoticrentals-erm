#!/usr/bin/env python3
"""Shared blog generation library for ERM (exoticrentalsmontreal.com).

Used by hermes-seo-blog.py (daily post) and hermes-seo-blog-batch.py (weekly
refill). Owns: fleet facts (from lib/vehicles.json + bookable /api/fleet
extras), the SEO/GEO prompt, content scrubbers, internal-link whitelist
(fetched from the live sitemap), hero-image matching, and the pre-publish
validation gate.

Rules encoded here (Sept 2026 audit):
- NO em/en dashes in published text (Po's hard rule) -> scrubbed.
- Only current-fleet cars with real prices -> fleet block built from
  lib/vehicles.json so fleet edits propagate automatically.
- Internal links must resolve -> whitelist from the live sitemap, unknown
  links are stripped to plain text, known mangled URLs are auto-fixed.
- No reasoning-leak fallback: if the model returns thinking instead of
  content, the attempt fails and retries. Never publish reasoning.
"""

import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path("/Users/pogod/.openclaw/workspace/exoticrentals-erm")
BLOG_FILE = REPO / "lib" / "blog-posts.ts"
SITE = "exoticrentalsmontreal.com"
SITEMAP_URL = f"https://www.{SITE}/sitemap.xml"
PHONE = "438-809-4417"
PHONE_TEL = "+14388094417"
WHATSAPP = "https://wa.me/14388094417"
API_URL = "https://ollama.com/v1/chat/completions"
DAILY_MODEL = "glm-5.3"
BATCH_MODEL = "glm-5.3-flash"

# Bookable-only cars (live /api/fleet Sept 2026) that have no showcase entry
# in vehicles.json. Showcase cars carry their own prices. Re-verify against
# https://www.exoticrentalsmontreal.com/api/fleet when the DB changes.
BOOKABLE_EXTRAS = [
    ("Audi RS5", 400, "450 hp, 0-100 in 3.9s", "/cars/audi-rs5"),
    ("Audi RS6", 549, "591 hp, 0-100 in 3.6s", "/cars/audi-rs6"),
    ("BMW M5 Competition", 599, "617 hp, 0-100 in 3.4s", "/cars/bmw-m5-competition"),
    ("Audi R8 V10", 899, "562 hp, 0-100 in 3.2s", "/cars/audi-r8"),
    ("McLaren 600LT", 1199, "592 hp, 0-100 in 2.9s", "/cars/mclaren-600lt"),
    ("Lamborghini Urus Black on Black", 1200, "641 hp, 0-100 in 3.5s", "/cars/lamborghini-urus-black-on-black"),
    ("Toyota GR Supra", 400, "420 hp, 0-100 in 3.9s", "/cars/toyota-supra"),
]

# topic keyword -> local hero image (confident matches only; existence is
# checked against public/ at runtime before assignment)
CAR_IMAGES = [
    ("huracan tecnica", "/cars/huracan_tecnica1.jpg"),
    ("huracan spyder", "/cars/huracan_spyder1.jpg"),
    ("huracan evo spyder", "/cars/huracan_spyder1.jpg"),
    ("huracan evo", "/cars/huracan_evo1.jpg"),
    ("huracan", "/cars/huracan_evo1.jpg"),
    ("600lt spider", "/cars/mclaren.jpg"),
    ("600lt", "/cars/mclaren.jpg"),
    ("mclaren", "/cars/mclaren.jpg"),
    ("urus", "/cars/urus_black1.jpg"),
    ("rs7", "/cars/rs7.jpg"),
    ("rs6", "/cars/rs6.jpg"),
    ("rs5", "/cars/rs5.jpg"),
    ("r8 spyder", "/cars/r8.jpg"),
    ("r8", "/cars/r8.jpg"),
    ("m5 competition", "/cars/m5.jpg"),
    ("bmw m5", "/cars/m5.jpg"),
    ("m3 competition", "/cars/m3_isle1.jpg"),
    ("bmw m3", "/cars/m3_isle1.jpg"),
    ("g63", "/cars/g63.jpg"),
    ("g-wagon", "/cars/g63.jpg"),
    ("g wagon", "/cars/g63.jpg"),
    ("macan", "/cars/porsche_macan_1.jpg"),
]

# URLs the model mangles (usually hyphen-stripped) -> real path
KNOWN_LINK_FIXES = {
    "/ferrarirentalmontreal": "/ferrari-rental-montreal",
    "/lamborghinirentalmontreal": "/lamborghini-rental-montreal",
    "/mclarenrentalmontreal": "/mclaren-rental-montreal",
    "/porschere natalmontreal": "/porsche-rental-montreal",
    "/porscherentalmontreal": "/porsche-rental-montreal",
    "/audirentalmontreal": "/audi-rental-montreal",
    "/bmwrentalmontreal": "/bmw-rental-montreal",
    "/mercedesrentalmontreal": "/mercedes-rental-montreal",
    "/locations/montreal": "/locations",
    "/car-rentalmontreal": "/car-rental-montreal",
    "/luxury-car-rentalmontreal": "/luxury-car-rental-montreal",
}

# Fallback whitelist if the live sitemap can't be fetched
FALLBACK_PATHS = [
    "/", "/faq", "/contact", "/blog", "/fleet", "/experience", "/about",
    "/reviews", "/services", "/how-it-works", "/locations",
    "/car-rental-montreal", "/luxury-car-rental-montreal",
    "/location-voiture-de-luxe-montreal",
    "/audi-rental-montreal", "/mercedes-rental-montreal", "/bmw-rental-montreal",
    "/lamborghini-rental-montreal", "/mclaren-rental-montreal",
    "/ferrari-rental-montreal", "/porsche-rental-montreal",
] + [p for _, _, _, p in BOOKABLE_EXTRAS]

EM_DASH = "\u2014"
EN_DASH = "\u2013"


def get_api_key() -> str:
    key = os.environ.get("OLLAMA_API_KEY", "")
    if key:
        return key
    env_file = Path.home() / ".hermes" / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("OLLAMA_API_KEY="):
                return line.split("=", 1)[1].strip()
    print("ERROR: OLLAMA_API_KEY not found (env or ~/.hermes/.env)")
    sys.exit(1)


def get_existing_slugs() -> set:
    content = BLOG_FILE.read_text()
    slugs_single = set(re.findall(r"slug:\s*'([^']+)'", content))
    slugs_double = set(re.findall(r'slug:\s*"([^"]+)"', content))
    return slugs_single | slugs_double


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def fleet_lines() -> str:
    """Fleet facts block for the prompt. Read from lib/vehicles.json so fleet
    edits propagate to the generator without touching this file."""
    def fmt_price(v):
        return f"${v['dailyRate']:,}"
    lines = []
    try:
        vj = json.loads((REPO / "lib" / "vehicles.json").read_text())
        for v in vj.get("vehicles", []):
            if not v.get("available"):
                continue
            hp = v.get("horsepower", "")
            sprint = v.get("zeroToSixty", "")
            spec = f", {hp} hp" if hp else ""
            spec += f", 0-100 in {sprint}" if sprint else ""
            lines.append(f"- {v['make']} {v['model']}: {fmt_price(v)}/day{spec} ({v['slug']})")
    except Exception as e:
        print(f"WARN: could not read vehicles.json ({e}); fleet block incomplete")
    for name, rate, spec, path in BOOKABLE_EXTRAS:
        lines.append(f"- {name}: ${rate:,}/day, {spec} ({path})")
    if not lines:
        print("ERROR: empty fleet block, refusing to generate")
        sys.exit(1)
    return "\n".join(lines)


def build_whitelist() -> set:
    """Internal-link whitelist: live sitemap paths + existing blog slugs.
    Falls back to a static list if the fetch fails."""
    wl = set(FALLBACK_PATHS)
    try:
        req = urllib.request.Request(SITEMAP_URL, headers={"User-Agent": "Mozilla/5.0"})
        sm = urllib.request.urlopen(req, timeout=30).read().decode()
        for loc in re.findall(r"<loc>([^<]+)</loc>", sm):
            path = loc.replace(f"https://www.{SITE}", "") or "/"
            wl.add(path)
        print(f"Whitelist: {len(wl)} paths from live sitemap")
    except Exception as e:
        print(f"WARN: sitemap fetch failed ({e}); using fallback whitelist")
        try:
            vj = json.loads((REPO / "lib" / "vehicles.json").read_text())
            for v in vj.get("vehicles", []):
                if v.get("available"):
                    wl.add(f"/fleet/{v['slug']}")
        except Exception:
            pass
    for s in get_existing_slugs():
        wl.add(f"/blog/{s}")
    return wl


def linkable_paths_for_prompt(wl: set) -> str:
    """Compact view of the whitelist for the prompt: brand + core pages,
    car pages, locations, plus 'any /blog/<existing post>' note."""
    brand = sorted(p for p in wl if "rental-montreal" in p and p.count("/") == 1 and p != "/")
    core = [p for p in ["/faq", "/contact", "/blog", "/fleet", "/reviews", "/how-it-works"] if p in wl]
    fleet = sorted(p for p in wl if p.startswith("/fleet/"))[:25]
    cars = sorted(p for p in wl if p.startswith("/cars/"))
    locs = sorted(p for p in wl if p.startswith("/locations/") and p != "/locations")
    parts = []
    parts.append("Core pages: " + ", ".join(core))
    parts.append("Brand pages: " + ", ".join(brand))
    if cars:
        parts.append("Bookable car pages: " + ", ".join(cars))
    if fleet:
        parts.append("Showcase fleet pages (pick only if relevant): " + ", ".join(fleet))
    if locs:
        parts.append("Location pages (pick only if relevant): " + ", ".join(locs))
    parts.append("Related blog posts: /blog/<slug> of an existing post, only when tightly related")
    return "\n".join(parts)


def pick_image(topic_text: str):
    """Return a local hero image path if the topic clearly matches a car
    we have a photo for. None otherwise (post renders without image)."""
    t = topic_text.lower()
    for key, img in CAR_IMAGES:
        if key in t:
            if (REPO / "public" / img.lstrip("/")).exists():
                return img
            return None
    return None


def scrub_content(content: str, wl: set) -> tuple:
    """Mechanical cleanup before validation. Returns (content, log)."""
    log = []
    # 1. reasoning leaks (GLM sometimes outputs its planning steps)
    new = re.sub(r"^\d+\.\s+\*\*[^*\n]+\*\*:?.*$\n?", "", content, flags=re.M)
    if new != content:
        log.append("stripped reasoning-leak lines")
        content = new
    for marker in ("**Analyze", "**Goal**", "Analyze the Request"):
        if marker in content:
            content = content.split(marker)[0]
            log.append(f"truncated at reasoning marker {marker!r}")
    # 2. digit ranges: 15-20 with en/em dash -> "15 to 20"
    new = re.sub(r"(\d)\s*[—–]\s*(\d)", r"\1 to \2", content)
    if new != content:
        log.append("converted dash ranges to 'to'")
        content = new
    # 3. remaining em/en dashes -> comma
    if EM_DASH in content or EN_DASH in content:
        n = content.count(EM_DASH) + content.count(EN_DASH)
        content = re.sub(r"\s*[—–]\s*", ", ", content)
        log.append(f"replaced {n} em/en dashes")
    content = re.sub(r",\s*,", ",", content)
    content = re.sub(r"\s+,", ",", content)
    content = re.sub(r",\s*\.", ".", content)
    # 4. price corruption like ];399/day -> $399/day (missing $1, prefix)
    new = re.sub(r"\];(\d{3})/day", r"$\1/day", content)
    if new != content:
        log.append("fixed corrupted prices")
        content = new
    # 5. known mangled URLs -> real paths
    for bad, good in KNOWN_LINK_FIXES.items():
        if bad in content:
            content = content.replace(bad, good)
            log.append(f"fixed link {bad} -> {good}")
    # 6. unknown internal links -> plain text (keep anchor, drop markup)
    def _link_sub(m):
        path = m.group(2)
        if path in wl:
            return m.group(0)
        log.append(f"stripped dead link {path}")
        return m.group(1)
    content = re.sub(r"\[([^\]]+)\]\((/[^)\s]+)\)", _link_sub, content)
    content = re.sub(r'href="(/[^"\s]+)"', lambda m: f'href="{m.group(1)}"' if m.group(1) in wl else 'href="#"', content)
    content = content.replace('href="#"', "")
    # 7. normalize blank-line separation so the renderer paragraph-wraps
    content = re.sub(r"\n{3,}", "\n\n", content)
    return content, log


def validate_post(post: dict, wl: set) -> list:
    """Hard gate. Returns list of error strings; empty == publishable."""
    errors = []
    content = post.get("content", "")
    # visible word count (strip HTML + markdown)
    text = re.sub(r"<[^>]+>", " ", content)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[#*`>_]", " ", text)
    words = len(text.split())
    if words < 700:
        errors.append(f"too thin: {words} words")
    if words > 2000:
        errors.append(f"too long: {words} words")
    if not re.search(r"(FAQ|Foire|Questions\s+Fr[eé]quentes)", content, re.I):
        errors.append("no FAQ section")
    flat = content.replace("438 809 4417", "438-809-4417")
    if "438-809-4417" not in flat and "14388094417" not in content:
        errors.append("CTA phone number missing")
    if EM_DASH in content or EN_DASH in content:
        errors.append("em/en dash survived scrub")
    if re.search(r"^\d+\.\s+\*\*", content, re.M) or "Analyze the Request" in content:
        errors.append("reasoning leak")
    links = re.findall(r"\]\((/[^)\s]+)\)", content)
    if len(links) < 2:
        errors.append(f"only {len(links)} internal links")
    for l in links:
        if l not in wl:
            errors.append(f"dead link {l}")
    desc = post.get("description", "")
    if not 130 <= len(desc) <= 180:
        errors.append(f"description length {len(desc)}")
    if not post.get("title", "").strip():
        errors.append("empty title")
    return errors


def build_prompts(topic: dict) -> tuple:
    kw = topic["kw"]
    title = topic["title"]
    angle = topic["angle"]
    is_french = angle == "french"
    wl = build_whitelist()

    system_prompt = f"""You are the senior content writer for Exotic Rentals Montreal (exoticrentalsmontreal.com), an exotic car rental company in Montreal by Gestion Exotics Inc. You write like a car enthusiast who actually drives these cars in Montreal: confident, direct, concrete, zero fluff.

BANNED PHRASES (never use): "in today's fast-paced world", "whether you're a seasoned pro or a first-timer", "imagine this", "it's no secret that", "elevate your experience", "seamless", "unforgettable", "unparalleled", "look no further", "dive into", "game-changer", "when it comes to", "nestled", "vibrant".

HARD RULES:
- NEVER use em dashes or en dashes. Use commas, periods, or colons instead.
- Prices use this exact format: $1,299/day. Use ONLY the prices in the fleet list below. Never invent a car, a price, or a spec.
- Mention ONLY cars from the fleet list below. If the topic names a car that is not in the list, redirect the post to the closest fleet car and say so plainly.
- Internal links in markdown format [anchor text](/path), using ONLY the paths provided below. 3 to 4 links per post, placed where they genuinely help.
- Separate every heading, paragraph, and list with a blank line.
- No word-for-word translation feel in French: natural Quebec French.

CURRENT FLEET (name: $rate/day, specs, page):
{fleet_lines()}

ALLOWED INTERNAL LINK PATHS:
{linkable_paths_for_prompt(wl)}

STRUCTURE (follow exactly, this format is what AI Overviews and Google cite):
1. First sentence: a direct 40 to 60 word answer to the main search query. No preamble, no scene setting, no hook. State the concrete answer (price range, requirement, verdict) immediately, including one hard number.
2. Then 4 to 6 sections with ## question-based headings that mirror real search queries (for example "## How Much Does It Cost to Rent a Lamborghini in Montreal?"). After each heading: give the 2 to 3 sentence answer first, then the supporting detail.
3. Include one specific data point (price, HP, 0-100 time, deposit, age rule) roughly every 150 words. AI engines cite passages with verifiable stats.
4. End with a FAQ section: "## FAQ" (French posts: "## Questions frequentes") containing 4 to 5 questions as ### headings, each answered in 2 to 3 standalone sentences that make sense without the question.
5. Final paragraph: booking CTA with phone {PHONE} (tel link) and WhatsApp {WHATSAPP}. Plain, one sentence, no pressure tactics.

LENGTH: 1000 to 1400 words.

Output ONLY valid JSON with exactly these keys:
{{
  "title": "the post title",
  "description": "150 to 170 character meta description containing the main keyword",
  "content": "the full post in markdown, ## headings, ## FAQ section, CTA at the end"
}}

Output ONLY the JSON object. No thinking, no analysis, no code fences. Start with {{ and end with }}."""

    lang_rule = (
        "Write the ENTIRE post in natural Quebec French (not France French). Keep car names and prices in the format shown."
        if is_french
        else "Write in English."
    )
    user_prompt = f"""Write a blog post targeting the keyword "{kw}".
Title to use exactly: {title}
Angle: {angle}
{lang_rule}

Requirements:
- Include the exact keyword "{kw}" in the first paragraph, in at least one ## heading, and naturally 2 to 3 more times.
- First sentence answers the search query directly with a hard number (for example: "Renting a Lamborghini in Montreal costs between $1,499 and $1,599 per day, delivered anywhere in Greater Montreal with a 24 hour minimum.").
- Use the structure from the system prompt: answer first, question-based ## headings, FAQ, CTA.
- 1000 to 1400 words.
- Do NOT use markdown bold. Only ## and ### headings, lists with "- ", paragraphs, and [text](/path) links."""

    return system_prompt, user_prompt


def _extract_json(raw: str):
    """Pull the first balanced JSON object out of a raw model response."""
    start = raw.find("{")
    if start == -1:
        return None
    depth = 0
    end = start
    in_string = False
    escape_next = False
    for i in range(start, len(raw)):
        ch = raw[i]
        if escape_next:
            escape_next = False
            continue
        if ch == "\\" and in_string:
            escape_next = True
            continue
        if ch == '"' and not escape_next:
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    raw_json = raw[start:end]
    raw_json = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", raw_json)
    try:
        return json.loads(raw_json)
    except json.JSONDecodeError:
        try:
            return json.loads(re.sub(r"(?<!\\)\n", " ", raw_json))
        except json.JSONDecodeError:
            return None


# module-level whitelist cache (fetch once per process)
_cached_whitelist = None


def cached_whitelist() -> set:
    global _cached_whitelist
    if _cached_whitelist is None:
        _cached_whitelist = build_whitelist()
    return _cached_whitelist


def generate_post(topic: dict, model: str = DAILY_MODEL, max_attempts: int = 3, fail_hard: bool = True):
    """Generate, scrub, and validate one post. Returns the post dict with
    keys title/description/content (+ image assigned by caller) or None.
    fail_hard=True exits the process on terminal failure (daily cron),
    fail_hard=False returns None so a batch can skip and continue."""
    system_prompt, user_prompt = build_prompts(topic)
    api_key = get_api_key()
    title = topic["title"]

    for attempt in range(1, max_attempts + 1):
        print(f"Generating: {title[:60]}... (attempt {attempt}/{max_attempts}, model {model})")
        payload = json.dumps({
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 16000,
            # GLM-5.x burns the whole max_tokens budget on chain-of-thought
            # before writing content (finish_reason=length, empty content,
            # 27k reasoning tokens observed). Low effort keeps a short plan
            # and leaves room for the post itself.
            "reasoning": {"effort": "low"},
        }).encode("utf-8")
        req = urllib.request.Request(
            API_URL,
            data=payload,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
        )
        raw = None
        try:
            with urllib.request.urlopen(req, timeout=240) as resp:
                result = json.loads(resp.read().decode("utf-8"))
            raw = result["choices"][0]["message"].get("content", "")
        except Exception as e:
            print(f"  API error: {e}")
            continue

        # NOTE: no reasoning fallback. If the model returned thinking instead
        # of content, this attempt fails. Never publish internal reasoning.
        if not raw or not raw.strip():
            print("  Empty content (reasoning-only response), retrying")
            continue
        post = _extract_json(raw)
        if not post or "content" not in post:
            print("  Could not parse JSON from response, retrying")
            continue
        # deterministic title: slug comes from the topic title
        post["title"] = title
        wl = cached_whitelist()
        post["content"], log = scrub_content(post["content"], wl)
        for l in log:
            print(f"  scrub: {l}")
        errors = validate_post(post, wl)
        if errors:
            for e in errors:
                print(f"  INVALID: {e}")
            continue
        words = len(re.sub(r"<[^>]+>|[#*`]", " ", post["content"]).split())
        print(f"  OK: {words} words, validated")
        return post

    msg = f"FAILED after {max_attempts} attempts: {title}"
    if fail_hard:
        print(f"❌ {msg} — nothing published, no duplicate fallback")
        sys.exit(1)
    print(f"  ❌ {msg}, skipping")
    return None


def md_to_ts_template(md: str) -> str:
    md = md.replace("`", "\\`")
    md = md.replace("${", "\\${")
    return md


def insert_post(slug: str, title: str, description: str, content: str, image: str = None) -> None:
    ts_content = md_to_ts_template(content)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    escaped_title = title.replace("'", "\\'")
    escaped_desc = description.replace("'", "\\'")
    image_line = f"    image: '{image}',\n" if image else ""
    new_post = f"""  {{
    slug: '{slug}',
    title: '{escaped_title}',
    date: '{today}',
    description: '{escaped_desc}',
{image_line}    content: `{ts_content}`,
  }}"""
    original = BLOG_FILE.read_text()
    insert_after = "export const BLOG_POSTS: BlogPost[] = [\n"
    idx = original.find(insert_after)
    if idx == -1:
        print("ERROR: Could not find BLOG_POSTS array in file")
        sys.exit(1)
    insert_pos = idx + len(insert_after)
    BLOG_FILE.write_text(original[:insert_pos] + new_post + ",\n" + original[insert_pos:])
    print(f"✅ Inserted post: {slug}" + (f" (image {image})" if image else ""))