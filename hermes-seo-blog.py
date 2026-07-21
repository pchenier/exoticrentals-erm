#!/usr/bin/env python3
"""
SEO Blog Auto-Generator for exoticrentalsmontreal.com
Generates a new blog post daily and pushes to production.

Usage:
  python3 hermes-seo-blog.py          # generate and deploy
  python3 hermes-seo-blog.py --dry-run # generate only, don't deploy
"""

import json
import os
import re
import sys
import subprocess
from datetime import datetime, timezone
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────
SITE = "exoticrentalsmontreal.com"
PHONE = "438-809-4417"
PHONE_TEL = "+14388094417"
WHATSAPP = "https://wa.me/14388094417"
REPO = Path("/Users/pogod/.openclaw/workspace/exoticrentals-erm")
BLOG_FILE = REPO / "lib" / "blog-posts.ts"
DRY_RUN = "--dry-run" in sys.argv

# ── Blog Topics ─────────────────────────────────────────────────────────────
TOPICS = [
    # Brand + model specific
    {"kw": "Lamborghini Huracan rental Montreal", "title": "Lamborghini Huracan Rental Montreal: V10 Drama on Every Street", "model": "lamborghini-huracan-evo", "angle": "review"},
    {"kw": "McLaren 600LT rental Montreal", "title": "McLaren 600LT Rental Montreal: Pure Supercar Adrenaline", "model": "mclaren-600lt", "angle": "experience"},
    {"kw": "Ferrari 488 GTB rental Montreal", "title": "Ferrari 488 GTB Rental Montreal: Italian Engineering at Its Finest", "model": "ferrari-488", "angle": "review"},
    {"kw": "Audi RS7 rental Montreal", "title": "Audi RS7 Rental Montreal: The Sleeper Sedan That Wakes Up Montreal", "model": "audi-rs7", "angle": "review"},
    {"kw": "BMW M5 Competition rental Montreal", "title": "BMW M5 Competition Rental Montreal: 625hp of M Power", "model": "bmw-m5", "angle": "experience"},
    {"kw": "Porsche 911 Techart rental Montreal", "title": "Porsche 911 Techart Rental Montreal: Modified Perfection", "model": "porsche-911", "angle": "review"},
    {"kw": "Lamborghini Urus rental Montreal", "title": "Lamborghini Urus Rental Montreal: The Super SUV That Rules the Road", "model": "lamborghini-urus", "angle": "review"},
    {"kw": "Mercedes E63S AMG rental Montreal", "title": "Mercedes E63S AMG Rental Montreal: Luxury Meets Raw Power", "model": "mercedes-e63s", "angle": "review"},
    {"kw": "Audi R8 V10 rental Montreal", "title": "Audi R8 V10 Rental Montreal: The Last Naturally Aspirated V10", "model": "audi-r8", "angle": "experience"},
    {"kw": "BMW X6M Competition rental Montreal", "title": "BMW X6M Competition Rental Montreal: Aggressive SUV Performance", "model": "bmw-x6m", "angle": "review"},
    # Location specific
    {"kw": "exotic car rental Old Montreal", "title": "Exotic Car Rental Old Montreal: Supercars in the Historic Quarter", "model": None, "angle": "location"},
    {"kw": "exotic car rental Laval", "title": "Exotic Car Rental Laval: Supercars Delivered North of Montreal", "model": None, "angle": "location"},
    {"kw": "exotic car rental Westmount", "title": "Exotic Car Rental Westmount: Premium Cars for Montreal's Best Neighbourhood", "model": None, "angle": "location"},
    {"kw": "exotic car rental Longueuil", "title": "Exotic Car Rental Longueuil: South Shore Luxury Delivery", "model": None, "angle": "location"},
    {"kw": "exotic car rental Plateau Mont-Royal", "title": "Exotic Car Rental Plateau Mont-Royal: Arrive in Style", "model": None, "angle": "location"},
    {"kw": "luxury car rental Montreal airport YUL", "title": "Luxury Car Rental Montreal Airport YUL: Delivered to Your Terminal", "model": None, "angle": "location"},
    {"kw": "exotic car rental Brossard", "title": "Exotic Car Rental Brossard: Luxury Cars on the South Shore", "model": None, "angle": "location"},
    {"kw": "exotic car rental West Island Montreal", "title": "Exotic Car Rental West Island: Premium Delivery Across the West", "model": None, "angle": "location"},
    # Occasion specific
    {"kw": "wedding exotic car rental Montreal", "title": "Wedding Exotic Car Rental Montreal: Make Your Entrance Unforgettable", "model": None, "angle": "occasion"},
    {"kw": "prom exotic car rental Montreal", "title": "Prom Exotic Car Rental Montreal: Arrive Like a Rockstar", "model": None, "angle": "occasion"},
    {"kw": "photoshoot car rental Montreal exotic", "title": "Photoshoot Car Rental Montreal: Supercars for Film and Photo", "model": None, "angle": "occasion"},
    {"kw": "birthday exotic car rental Montreal", "title": "Birthday Exotic Car Rental Montreal: The Ultimate Gift", "model": None, "angle": "occasion"},
    {"kw": "corporate luxury car rental Montreal", "title": "Corporate Exotic Car Rental Montreal: Impress Clients and Executives", "model": None, "angle": "occasion"},
    # Seasonal / general
    {"kw": "best exotic car rental Montreal 2026", "title": "Best Exotic Car Rental Montreal 2026: The Complete Guide", "model": None, "angle": "guide"},
    {"kw": "luxury SUV rental Montreal exotic", "title": "Luxury SUV Rental Montreal: Urus, X6M, and More", "model": None, "angle": "guide"},
    {"kw": "how much does it cost to rent a Lamborghini in Montreal", "title": "How Much Does It Cost to Rent a Lamborghini in Montreal?", "model": None, "angle": "guide"},
    {"kw": "exotic car rental insurance Quebec", "title": "Exotic Car Rental Insurance Quebec: What You Need to Know", "model": None, "angle": "guide"},
    {"kw": "exotic car rental deposit Montreal", "title": "Exotic Car Rental Deposit Montreal: What to Expect", "model": None, "angle": "guide"},
    # French content for bilingual SEO
    {"kw": "location voiture exotique Montreal", "title": "Location Voiture Exotique Montreal: Supercars Livrées à Votre Porte", "model": None, "angle": "french"},
    {"kw": "location Lamborghini Montreal", "title": "Location Lamborghini Montreal: Huracán et Urus Disponibles", "model": None, "angle": "french"},
    {"kw": "location voiture sport Montreal", "title": "Location Voiture Sport Montreal: Ferrari, McLaren, Porsche", "model": None, "angle": "french"},
    {"kw": "louer McLaren Montreal", "title": "Louer McLaren Montreal: 600LT Disponible dès Maintenant", "model": None, "angle": "french"},
    {"kw": "location Ferrari Montreal", "title": "Location Ferrari Montreal: 488 GTB et Plus", "model": None, "angle": "french"},
]

# ── Helper: Generate slug ───────────────────────────────────────────────────
def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")

# ── Step 1: Pick a topic ────────────────────────────────────────────────────
def pick_topic(existing_slugs: set) -> dict:
    """Pick the next topic that hasn't been written yet.
    Falls back to batch topics when original list is exhausted."""
    for topic in TOPICS:
        slug = slugify(topic["title"])
        if slug not in existing_slugs:
            return topic

    # Original list exhausted — try batch topics
    try:
        batch_script = REPO / "hermes-seo-blog-batch.py"
        if batch_script.exists():
            batch_content = batch_script.read_text()
            topics_start = batch_content.find('NEW_TOPICS = [')
            topics_end = batch_content.find(']\n', topics_start) + 1
            topics_block = batch_content[topics_start:topics_end]
            for m in re.finditer(r'"title":\s*"([^"]+)"', topics_block):
                title = m.group(1)
                slug = slugify(title)
                if slug not in existing_slugs:
                    # Find matching kw and angle
                    kw_match = re.search(rf'"kw":\s*"([^"]+)"[^}}]*"title":\s*"{re.escape(title)}"[^}}]*"angle":\s*"([^"]+)"', topics_block)
                    if kw_match:
                        return {"kw": kw_match.group(1), "title": title, "model": None, "angle": kw_match.group(2)}
    except Exception:
        pass

    # All topics done — cycle with a date suffix
    topic = TOPICS[len(existing_slugs) % len(TOPICS)]
    topic = {**topic, "title": topic["title"].rstrip(" 2026") + f" ({datetime.now().year})"}
    return topic

# ── Step 2: Get existing slugs ───────────────────────────────────────────────
def get_existing_slugs() -> set:
    content = BLOG_FILE.read_text()
    # Match both single and double quoted slugs
    slugs_single = set(re.findall(r"slug:\s*'([^']+)'", content))
    slugs_double = set(re.findall(r'slug:\s*"([^"]+)"', content))
    return slugs_single | slugs_double

# ── Step 3: Generate blog content via API ───────────────────────────────────
def generate_post(topic: dict) -> dict:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    kw = topic["kw"]
    title = topic["title"]
    angle = topic["angle"]
    model_slug = topic.get("model") or ""

    system_prompt = """You are an expert SEO content writer for a luxury car rental company in Montreal called "Exotic Rentals Montreal" (by Gestion Exotics Inc.). Write in a confident, direct style — no fluff, no filler, no AI cliches. Avoid: "in today's fast-paced world", "whether you're a seasoned pro or a first-timer", "imagine this", "it's no secret that", "elevate your experience", "seamless", "unforgettable", "unparalleled". Write like a car enthusiast who knows Montreal.

Key facts to include naturally:
- Phone: 438-809-4417
- WhatsApp: wa.me/14388094417
- Delivery anywhere in Greater Montreal, 24/7
- Minimum age 25 for most vehicles, 21 for select models
- Minimum rental 1 day (24 hours)
- Security deposit varies by vehicle
- Full insurance required

Available vehicles: McLaren 600LT, Lamborghini Huracan Tecnica, Lamborghini Huracan EVO, Lamborghini Urus, Ferrari 488 GTB, Audi RS7, Audi RS6, Audi R8 V10, BMW M5 Competition, BMW M3 Competition, BMW X6M, Mercedes E63S AMG, Mercedes S63 AMG, Porsche 911 4S Techart, Porsche Panamera GTS, Audi RS5.

Output ONLY valid JSON with these exact keys:
{
  "title": "the blog post title",
  "description": "155-165 character meta description containing the main keyword",
  "content": "the full blog post in markdown, 1000-1400 words, with ## headings, natural keyword placement, and a CTA at the end"
}

IMPORTANT GEO RULES (AI-citable content format):
- AI search engines cite PASSAGES, not pages. 44% of citations come from the first 30% of text.
- Start with a DIRECT ANSWER to the implied search query in the FIRST sentence.
- Use QUESTION-BASED headings (e.g. "How Much Does It Cost to Rent a Lamborghini?" beats "Pricing")
- Include an FAQ section near the end with at least 4 questions as ## headings and concise 2-3 sentence answers.
- Pack 3-4 specific data points (prices, percentages, comparisons, HP numbers) — AI engines prioritize passages with verifiable stats.
- FAQ is the #1 most-cited format by Google AI Overviews and ChatGPT.

IMPORTANT: Output ONLY the JSON object. Do NOT think or reason. Do NOT wrap in code blocks. Start your response with { and end with }."""

    user_prompt = f"""Write a blog post targeting the keyword "{kw}".
Title: {title}
Angle: {angle}
Date: {today}

Requirements:
- 1000-1400 words
- Include the exact keyword "{kw}" in the first paragraph, at least one heading, and naturally 3-4 more times
- Start with a DIRECT ANSWER to the search query in the FIRST sentence (e.g. "Renting a Lamborghini in Montreal costs between $1,400 and $1,800 per day, depending on the model and season.")
- Use QUESTION-BASED ## headings (e.g. "## How Much Does It Cost?" instead of "## Pricing")
- Include an FAQ section near the end with at least 4 ## questions and concise 2-3 sentence answers
- Pack 3-4 specific data points (prices, HP numbers, 0-60 times, deposit amounts)
- Include 2-3 internal links using this format: [anchor text](/path) — available paths: /cars/[slug], /faq, /contact, /blog, /locations/[slug], /lamborghini-rental-montreal, /mclaren-rental-montreal, /ferrari-rental-montreal, /porsche-rental-montreal, /audi-rental-montreal, /bmw-rental-montreal, /mercedes-rental-montreal
- End with a CTA: phone number {PHONE} and WhatsApp link
- For French angle posts ("french"), write the ENTIRE post in French
- Make the content genuinely useful — real prices, real models, real Montreal locations
- Do NOT use any markdown bold (**text**) — only ## headings and regular text"""

    import urllib.request

    api_url = os.environ.get("OLLAMA_API_URL", "https://ollama.com/v1/chat/completions")
    api_key = os.environ.get("OLLAMA_API_KEY", "bd39f0f08b934b58bf69b740267f4c9d.xzl7vzW6hqFKYFMJ4ItvVlMr")

    # Retry up to 3 times if JSON parsing fails (GLM-5.1 sometimes outputs reasoning text)
    for attempt in range(1, 4):
        print(f"Generating post for: {title}... (attempt {attempt}/3)")

        req_data = json.dumps({
            "model": "glm-5.1",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 8000,
        }).encode("utf-8")

        req = urllib.request.Request(
            api_url,
            data=req_data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                raw_resp = resp.read().decode("utf-8")
        except Exception as e:
            print(f"ERROR: API request failed: {e}")
            if attempt < 3:
                print(f"Retrying ({attempt}/3)...")
                continue
            sys.exit(1)

        result = json.loads(raw_resp)

        if "choices" not in result:
            print(f"ERROR: Unexpected API response: {raw_resp[:500]}")
            if attempt < 3:
                print(f"Retrying ({attempt}/3)...")
                continue
            sys.exit(1)

        raw = result["choices"][0]["message"].get("content", "")

        if not raw.strip():
            reasoning = result["choices"][0]["message"].get("reasoning", "")
            if reasoning.strip():
                raw = reasoning
                print("(Using reasoning field as content)")

        if not raw.strip():
            print(f"ERROR: Empty response from API. Full result: {json.dumps(result, indent=2)[:500]}")
            if attempt < 3:
                print(f"Retrying ({attempt}/3)...")
                continue
            sys.exit(1)

        start = raw.find('{')
        if start == -1:
            print(f"ERROR: No JSON found in response. Raw output:\n{raw[:500]}")
            if attempt < 3:
                print(f"Retrying ({attempt}/3)...")
                continue
            sys.exit(1)

        depth = 0
        end = start
        in_string = False
        escape_next = False
        for i in range(start, len(raw)):
            ch = raw[i]
            if escape_next:
                escape_next = False
                continue
            if ch == '\\' and in_string:
                escape_next = True
                continue
            if ch == '"' and not escape_next:
                in_string = not in_string
                continue
            if in_string:
                continue
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break

        raw_json = raw[start:end]

        # Sanitize control chars that break JSON parsing
        raw_json = re.sub(r'[--]', '', raw_json)

        try:
            post_data = json.loads(raw_json)
            return post_data
        except json.JSONDecodeError as e:
            print(f"ERROR: Could not parse JSON: {e}")
            print(f"Raw JSON (first 300 chars): {raw_json[:300]}")
            print(f"Raw JSON (last 100 chars): {raw_json[-100:]}")
            if attempt < 3:
                print(f"Retrying ({attempt}/3)...")
                continue
            sys.exit(1)

    # Should never reach here, but just in case
    sys.exit(1)

# ── Step 4: Convert markdown content to TS template literal ─────────────────
def md_to_ts_template(md: str) -> str:
    md = md.replace("`", "\\`")
    md = md.replace("${", "\\${")
    return md

# ── Step 5: Insert into blog-posts.ts ────────────────────────────────────────
def insert_post(slug: str, title: str, description: str, content: str) -> None:
    ts_content = md_to_ts_template(content)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    escaped_title = title.replace("'", "\\'")
    escaped_desc = description.replace("'", "\\'")
    new_post = f"""  {{
    slug: '{slug}',
    title: '{escaped_title}',
    date: '{today}',
    description: '{escaped_desc}',
    content: `{ts_content}`,
  }}"""

    original = BLOG_FILE.read_text()

    insert_after = "export const BLOG_POSTS: BlogPost[] = [\n"
    idx = original.find(insert_after)
    if idx == -1:
        print("ERROR: Could not find BLOG_POSTS array in file")
        sys.exit(1)

    insert_pos = idx + len(insert_after)
    new_content = original[:insert_pos] + new_post + ",\n" + original[insert_pos:]
    BLOG_FILE.write_text(new_content)
    print(f"✅ Inserted post: {slug}")

# ── Step 6: Git commit, push, deploy ───────────────────────────────────────
def deploy(commit_msg: str) -> None:
    os.chdir(REPO)

    subprocess.run(["git", "add", "-A"], check=True)
    subprocess.run(["git", "commit", "-m", commit_msg], check=True)
    subprocess.run(["git", "push", "origin", "main"], check=True)

    result = subprocess.run(["vercel", "--prod"], capture_output=True, text=True, timeout=300)
    print(result.stdout[-200:] if len(result.stdout) > 200 else result.stdout)

    import json as j
    auth_file = Path("/Users/pogod/Library/Application Support/com.vercel.cli/auth.json")
    auth_data = j.loads(auth_file.read_text())
    token = auth_data["token"]

    repo_json = j.loads((REPO / ".vercel" / "repo.json").read_text())
    project_id = repo_json["projects"][0]["id"]

    import urllib.request
    url = f"https://api.vercel.com/v6/deployments?projectId={project_id}&limit=1"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        deployments = j.loads(resp.read().decode())
    deploy_uid = deployments["deployments"][0]["uid"]

    for domain in ["exoticrentalsmontreal.com", "www.exoticrentalsmontreal.com"]:
        data = j.dumps({"alias": domain}).encode()
        req = urllib.request.Request(
            f"https://api.vercel.com/v13/deployments/{deploy_uid}/aliases",
            data=data,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                print(f"✅ Promoted to {domain}")
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"⚠️  Promote {domain}: {e.code} {body[:200]}")

# ── Main ────────────────────────────────────────────────────────────────────
def main():
    existing = get_existing_slugs()
    print(f"Found {len(existing)} existing posts: {', '.join(list(existing)[:5])}...")

    topic = pick_topic(existing)
    slug = slugify(topic["title"])
    print(f"Selected topic: {topic['title']}")
    print(f"Slug: {slug}")
    print(f"Keyword: {topic['kw']}")
    print(f"Angle: {topic['angle']}")

    post = generate_post(topic)
    print(f"Generated post: {post['title'][:60]}...")
    print(f"Content length: {len(post['content'])} chars")

    if DRY_RUN:
        print("\n--- DRY RUN ---")
        print(f"Title: {post['title']}")
        print(f"Description: {post['description']}")
        print(f"Content preview: {post['content'][:300]}...")
        print("\nSkipping insert and deploy.")
        return

    insert_post(slug, post["title"], post["description"], post["content"])

    commit_msg = f"Blog: auto-add '{slug}'"
    deploy(commit_msg)
    print(f"\n🎉 Blog post published: {slug}")

if __name__ == "__main__":
    main()