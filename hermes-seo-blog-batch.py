#!/usr/bin/env python3
"""
SEO Blog Batch Generator for exoticrentalsmontreal.com
Generates N blog posts in one run, inserts them all, and deploys once.

Usage:
  python3 hermes-seo-blog-batch.py           # generate 30 posts and deploy
  python3 hermes-seo-blog-batch.py --count 10 # generate 10 posts
  python3 hermes-seo-blog-batch.py --dry-run  # generate but don't deploy
"""

import json
import os
import re
import sys
import time
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

# Parse count arg
BATCH_COUNT = 30
for i, arg in enumerate(sys.argv):
    if arg == "--count" and i + 1 < len(sys.argv):
        BATCH_COUNT = int(sys.argv[i + 1])

# ── Massive topic pool ───────────────────────────────────────────────────────
# 60+ fresh topics covering models, locations, occasions, seasons, comparisons, French, guides
NEW_TOPICS = [
    # ─── Model deep dives (specific angles) ───
    {"kw": "Audi RS7 Sportback rental Montreal", "title": "Audi RS7 Sportback Rental Montreal: The Ultimate Sleeper Sedan", "model": "audi-rs7", "angle": "review"},
    {"kw": "Lamborghini Huracan Tecnica vs EVO rental Montreal", "title": "Lamborghini Huracan Tecnica vs EVO: Which Montreal Rental Is Right for You", "model": "lamborghini-huracan-tecnica", "angle": "comparison"},
    {"kw": "McLaren 600LT vs Ferrari 488 rental Montreal", "title": "McLaren 600LT vs Ferrari 488 GTB: Montreal Supercar Showdown", "model": None, "angle": "comparison"},
    {"kw": "BMW M5 Competition vs Audi RS7 rental Montreal", "title": "BMW M5 Competition vs Audi RS7: Which 600hp Sedan to Rent in Montreal", "model": None, "angle": "comparison"},
    {"kw": "Mercedes E63S AMG vs BMW M5 rental Montreal", "title": "Mercedes E63S AMG vs BMW M5 Competition: German Sedan Battle in Montreal", "model": None, "angle": "comparison"},
    {"kw": "Porsche 911 Techart vs stock 911 rental Montreal", "title": "Porsche 911 Techart vs Stock 911: Why the Tuned Version Is Worth It", "model": "porsche-911", "angle": "comparison"},
    {"kw": "Lamborghini Urus vs Porsche Cayenne rental Montreal", "title": "Lamborghini Urus vs Porsche Cayenne: Luxury SUV Rental Montreal", "model": None, "angle": "comparison"},
    {"kw": "Audi R8 V10 vs McLaren 600LT rental Montreal", "title": "Audi R8 V10 vs McLaren 600LT: Mid-Engine Montreal Comparison", "model": None, "angle": "comparison"},

    # ─── More model-specific ───
    {"kw": "Mercedes G63 AMG rental Montreal", "title": "Mercedes G63 AMG Rental Montreal: The Iconic G-Wagon Experience", "model": "mercedes-g63", "angle": "review"},
    {"kw": "BMW M4 Competition rental Montreal", "title": "BMW M4 Competition Rental Montreal: Track-Day Precision on City Streets", "model": "bmw-m4", "angle": "review"},
    {"kw": "Porsche Taycan electric rental Montreal", "title": "Porsche Taycan Electric Rental Montreal: Luxury Goes Electric", "model": "porsche-taycan", "angle": "review"},
    {"kw": "Porsche Panamera GTS rental Montreal", "title": "Porsche Panamera GTS Rental Montreal: Four-Door Grand Touring Perfection", "model": "porsche-panamera-gts", "angle": "review"},
    {"kw": "Audi RS5 rental Montreal", "title": "Audi RS5 Rental Montreal: Sharp Design Meets V6 Twin-Turbo Power", "model": "audi-rs5", "angle": "review"},
    {"kw": "Porsche Macan GTS rental Montreal", "title": "Porsche Macan GTS Rental Montreal: The Compact SUV That Drives Like a Sports Car", "model": "porsche-macan-gts", "angle": "review"},
    {"kw": "BMW X5 M Competition rental Montreal", "title": "BMW X5 M Competition Rental Montreal: Family SUV With Supercar Speed", "model": "bmw-x5m", "angle": "review"},

    # ─── Seasonal / event ───
    {"kw": "exotic car rental Montreal F1 Grand Prix 2026", "title": "F1 Grand Prix Montreal 2026: Rent an Exotic Car for Race Weekend", "model": None, "angle": "occasion"},
    {"kw": "exotic car rental Montreal summer 2026", "title": "Summer 2026 Exotic Car Rental Montreal: Best Cars for the Season", "model": None, "angle": "seasonal"},
    {"kw": "exotic car rental Montreal winter", "title": "Winter Exotic Car Rental Montreal: AWD Supercars That Handle the Snow", "model": None, "angle": "seasonal"},
    {"kw": "exotic car rental Montreal Christmas", "title": "Christmas Exotic Car Rental Montreal: Give the Gift of Supercar Thrills", "model": None, "angle": "occasion"},
    {"kw": "exotic car rental Montreal Canada Day", "title": "Canada Day Exotic Car Rental Montreal: Celebrate in Supercar Style", "model": None, "angle": "occasion"},
    {"kw": "exotic car rental Montreal graduation prom", "title": "Graduation Exotic Car Rental Montreal: Arrive at Prom in a Lamborghini", "model": None, "angle": "occasion"},
    {"kw": "exotic car rental Montreal surprise proposal", "title": "Surprise Proposal Exotic Car Rental Montreal: Pull Up in a Ferrari", "model": None, "angle": "occasion"},
    {"kw": "exotic car rental Montreal music video shoot", "title": "Music Video Exotic Car Rental Montreal: Supercars for Film Productions", "model": None, "angle": "occasion"},
    {"kw": "exotic car rental Montreal VIP airport transfer", "title": "VIP Airport Transfer Montreal: Exotic Car Pickup at YUL", "model": None, "angle": "occasion"},

    # ─── Location deep dives ───
    {"kw": "exotic car rental Dorval Montreal airport", "title": "Exotic Car Rental Dorval: Supercar Delivery Near YUL Airport", "model": None, "angle": "location"},
    {"kw": "exotic car rental Griffintown Montreal", "title": "Exotic Car Rental Griffintown: Luxury Cars in Montreal's Hottest Neighbourhood", "model": None, "angle": "location"},
    {"kw": "exotic car rental Saint-Laurent Montreal", "title": "Exotic Car Rental Saint-Laurent: Supercar Delivery in the West Island", "model": None, "angle": "location"},
    {"kw": "exotic car rental Ahuntsic Montreal", "title": "Exotic Car Rental Ahuntsic: North Montreal Supercar Delivery", "model": None, "angle": "location"},
    {"kw": "luxury car rental Terrebonne Quebec", "title": "Luxury Car Rental Terrebonne: Supercar Delivery in Lanaudiere", "model": None, "angle": "location"},
    {"kw": "exotic car rental Blainville Quebec", "title": "Exotic Car Rental Blainville: North Shore Luxury Car Delivery", "model": None, "angle": "location"},
    {"kw": "exotic car rental Boucherville Quebec", "title": "Exotic Car Rental Boucherville: South Shore Supercar Delivery", "model": None, "angle": "location"},
    {"kw": "exotic car rental Vaudreuil Quebec", "title": "Exotic Car Rental Vaudreuil: West Island Luxury Car Delivery", "model": None, "angle": "location"},
    {"kw": "supercar rental Mont Tremblant", "title": "Supercar Rental Mont-Tremblant: Drive a Ferrari Through the Laurentians", "model": None, "angle": "location"},
    {"kw": "exotic car rental Quebec City", "title": "Exotic Car Rental Quebec City: Supercar Delivery Across the Province", "model": None, "angle": "location"},

    # ─── Practical guides ───
    {"kw": "exotic car rental Montreal no deposit", "title": "Exotic Car Rental Montreal With Reduced Deposit Options", "model": None, "angle": "guide"},
    {"kw": "exotic car rental Montreal age requirement", "title": "Exotic Car Rental Montreal Age Requirements: Everything You Need to Know", "model": None, "angle": "guide"},
    {"kw": "exotic car rental Montreal insurance coverage", "title": "Exotic Car Rental Montreal Insurance Guide: Full Coverage Explained", "model": None, "angle": "guide"},
    {"kw": "exotic car rental Montreal delivery to hotel", "title": "Exotic Car Rental Montreal Hotel Delivery: We Bring the Car to You", "model": None, "angle": "guide"},
    {"kw": "exotic car rental Montreal price comparison", "title": "Exotic Car Rental Montreal Price Comparison: How Much Does Each Car Cost", "model": None, "angle": "guide"},
    {"kw": "exotic car rental Montreal crypto payment", "title": "Exotic Car Rental Montreal Crypto Payment: Bitcoin and More Accepted", "model": None, "angle": "guide"},
    {"kw": "best roads to drive exotic car Montreal", "title": "Best Roads to Drive an Exotic Car Near Montreal: Scenic Routes Guide", "model": None, "angle": "guide"},
    {"kw": "exotic car rental Montreal vs Toronto", "title": "Exotic Car Rental Montreal vs Toronto: Why Montreal Is Better", "model": None, "angle": "guide"},
    {"kw": "exotic car rental Montreal reviews", "title": "Exotic Car Rental Montreal Reviews: What Customers Really Think", "model": None, "angle": "guide"},
    {"kw": "exotic car rental Montreal first time guide", "title": "First Time Exotic Car Rental Montreal: Complete Beginner Guide", "model": None, "angle": "guide"},

    # ─── Experience / lifestyle ───
    {"kw": "exotic car rental Montreal date night", "title": "Date Night Exotic Car Rental Montreal: Impress With a Ferrari or Lamborghini", "model": None, "angle": "occasion"},
    {"kw": "luxury car rental Montreal bachelor party", "title": "Bachelor Party Luxury Car Rental Montreal: The Ultimate Send-Off", "model": None, "angle": "occasion"},
    {"kw": "exotic car rental Montreal real estate photography", "title": "Real Estate Photography With Exotic Cars in Montreal", "model": None, "angle": "occasion"},
    {"kw": "supercar experience Montreal track day", "title": "Supercar Track Day Montreal: Where to Open It Up Legally", "model": None, "angle": "experience"},
    {"kw": "exotic car rental Montreal road trip Laurentians", "title": "Exotic Car Road Trip: Montreal to the Laurentians in a Supercar", "model": None, "angle": "experience"},
    {"kw": "exotic car rental Montreal road trip Eastern Townships", "title": "Supercar Road Trip: Montreal to Eastern Townships", "model": None, "angle": "experience"},

    # ─── French content (SEO bilingue) ───
    {"kw": "location Porsche 911 Techart Montreal", "title": "Location Porsche 911 Techart Montreal: Le Modifie Qui Fait la Difference", "model": "porsche-911", "angle": "french"},
    {"kw": "location BMW X6M Competition Montreal", "title": "Location BMW X6M Competition Montreal: SUV Sportif Disponible", "model": "bmw-x6m", "angle": "french"},
    {"kw": "louer Mercedes S63 AMG Montreal", "title": "Louer Mercedes S63 AMG Montreal: Berline de Luxe et Performance", "model": "mercedes-s63", "angle": "french"},
    {"kw": "location Audi R8 Montreal prix", "title": "Location Audi R8 V10 Montreal: Prix, Specs et Reservation", "model": "audi-r8", "angle": "french"},
    {"kw": "location voiture exotique rive-sud Montreal", "title": "Location Voiture Exotique Rive-Sud Montreal: Livraison a Brossard et Longueuil", "model": None, "angle": "french"},
    {"kw": "location voiture exotique Laurentides", "title": "Location Voiture Exotique Laurentides: Supercars pour Route Scenique", "model": None, "angle": "french"},
    {"kw": "meilleure location voiture luxe Montreal", "title": "Meilleure Location Voiture Luxe Montreal 2026: Guide Complet", "model": None, "angle": "french"},
    {"kw": "location voiture exotique Montreal pas cher", "title": "Location Voiture Exotique Montreal pas Cher: Offres et Promotions", "model": None, "angle": "french"},
    {"kw": "louer voiture sport Montreal weekend", "title": "Louer Voiture Sport Montreal: Le Weekend Parfait en Supercar", "model": None, "angle": "french"},
    {"kw": "location voiture exotique Montreal mariage", "title": "Location Voiture Exotique Montreal pour Mariage: Arrivez en Style", "model": None, "angle": "french"},
    {"kw": "location voiture luxe Montreal aeroport", "title": "Location Voiture Luxe Montreal Aeroport: Livraison a YUL", "model": None, "angle": "french"},
    {"kw": "assurance location voiture exotique Quebec", "title": "Assurance Location Voiture Exotique Quebec: Tout Ce Qu'il Faut Savoir", "model": None, "angle": "french"},
    {"kw": "depot location voiture exotique Montreal", "title": "Depot Location Voiture Exotique Montreal: Comment Ca Marche", "model": None, "angle": "french"},
    {"kw": "location voiture exotique Saint-Jean-sur-Richelieu", "title": "Location Voiture Exotique Saint-Jean-sur-Richelieu: Livraison Sud-Shore", "model": None, "angle": "french"},
    {"kw": "location supercar Montreal finissants", "title": "Location Supercar Montreal Finissants: Arrivez au Bal en Lamborghini", "model": None, "angle": "french"},
]

# ── Helper: Generate slug ───────────────────────────────────────────────────
def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")

# ── Get existing slugs ──────────────────────────────────────────────────────
def get_existing_slugs() -> set:
    content = BLOG_FILE.read_text()
    # Match both single and double quoted slugs
    slugs_single = set(re.findall(r"slug:\s*'([^']+)'", content))
    slugs_double = set(re.findall(r'slug:\s*"([^"]+)"', content))
    return slugs_single | slugs_double

# ── Pick N topics that haven't been written yet ─────────────────────────────
def pick_topics(existing_slugs: set, count: int) -> list:
    """Pick up to `count` topics not yet covered."""
    picked = []
    for topic in NEW_TOPICS:
        slug = slugify(topic["title"])
        if slug not in existing_slugs:
            picked.append((topic, slug))
            if len(picked) >= count:
                break
    return picked

# ── Generate blog content via API ───────────────────────────────────────────
def generate_post(topic: dict) -> dict:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    kw = topic["kw"]
    title = topic["title"]
    angle = topic["angle"]

    system_prompt = """You are an expert SEO content writer for a luxury car rental company in Montreal called "Exotic Rentals Montreal" (by Gestion Exotics Inc.). Write in a confident, direct style — no fluff, no filler, no AI cliches. Avoid: "in today's fast-paced world", "whether you're a seasoned pro or a first-timer", "imagine this", "it's no secret that", "elevate your experience", "seamless", "unforgettable", "unparalleled". Write like a car enthusiast who knows Montreal.

Key facts to include naturally:
- Phone: 438-809-4417
- WhatsApp: wa.me/14388094417
- Delivery anywhere in Greater Montreal, 24/7
- Minimum age 25 for most vehicles, 21 for select models
- Minimum rental 1 day (24 hours)
- Security deposit varies by vehicle
- Full insurance required

Available vehicles: McLaren 600LT, Lamborghini Huracan Tecnica, Lamborghini Huracan EVO, Lamborghini Urus, Ferrari 488 GTB, Audi RS7, Audi RS6, Audi R8 V10, BMW M5 Competition, BMW M3 Competition, BMW M4 Competition, BMW X6M, BMW X5 M Competition, Mercedes E63S AMG, Mercedes S63 AMG, Mercedes G63 AMG, Porsche 911 4S Techart, Porsche Panamera GTS, Porsche Macan GTS, Porsche Taycan 4S, Audi RS5, Audi RS6 Avant.

Output ONLY valid JSON with these exact keys:
{
  "title": "the blog post title",
  "description": "155-165 character meta description containing the main keyword",
  "content": "the full blog post in markdown, 800-1200 words, with ## headings, natural keyword placement, and a CTA at the end"
}

IMPORTANT: Output ONLY the JSON object. Do NOT think or reason. Do NOT wrap in code blocks. Start your response with { and end with }."""

    user_prompt = f"""Write a blog post targeting the keyword "{kw}".
Title: {title}
Angle: {angle}
Date: {today}

Requirements:
- 800-1200 words
- Include the exact keyword "{kw}" in the first paragraph, at least one heading, and naturally 3-4 more times
- Use ## headings for structure
- Include 2-3 internal links using this format: [anchor text](/path) — available paths: /cars/[slug], /faq, /contact, /blog, /locations/[slug], /lamborghini-rental-montreal, /mclaren-rental-montreal, /ferrari-rental-montreal, /porsche-rental-montreal, /audi-rental-montreal, /bmw-rental-montreal, /mercedes-rental-montreal
- End with a CTA: phone number {PHONE} and WhatsApp link
- For French angle posts ("french"), write the ENTIRE post in French
- Make the content genuinely useful — real prices, real models, real Montreal locations
- Do NOT use any markdown bold (**text**) — only ## headings and regular text"""

    import urllib.request

    api_url = os.environ.get("OLLAMA_API_URL", "https://ollama.com/v1/chat/completions")
    api_key = os.environ.get("OLLAMA_API_KEY", "bd39f0f08b934b58bf69b740267f4c9d.xzl7vzW6hqFKYFMJ4ItvVlMr")

    payload = json.dumps({
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
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )

    print(f"  Generating: {title[:50]}...")
    with urllib.request.urlopen(req, timeout=180) as resp:
        raw_resp = resp.read().decode("utf-8")

    result = json.loads(raw_resp)

    if "choices" not in result:
        print(f"ERROR: Unexpected API response: {raw_resp[:500]}")
        return {}

    raw = result["choices"][0]["message"].get("content", "")

    if not raw.strip():
        reasoning = result["choices"][0]["message"].get("reasoning", "")
        if reasoning.strip():
            raw = reasoning
            print("  (Using reasoning field as content)")

    if not raw.strip():
        print(f"ERROR: Empty response from API.")
        return {}

    # Extract JSON from response
    start = raw.find('{')
    if start == -1:
        print(f"ERROR: No JSON found in response.")
        return {}

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

    # Clean up control characters that break JSON parsing
    # Remove null bytes, vertical tabs, etc. but keep \n \r \t
    import re as _re
    raw_json = _re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', raw_json)

    try:
        post_data = json.loads(raw_json)
    except json.JSONDecodeError as e:
        print(f"ERROR: Could not parse JSON: {e}")
        # Try more aggressive cleanup: replace newlines inside strings
        try:
            raw_json_clean = _re.sub(r'(?<!\\)\n', ' ', raw_json)
            post_data = json.loads(raw_json_clean)
        except json.JSONDecodeError:
            print(f"ERROR: Still could not parse after cleanup")
            return {}

    if not post_data:
        return {}

    return post_data

# ── Convert markdown to TS template literal ─────────────────────────────────
def md_to_ts_template(md: str) -> str:
    md = md.replace("`", "\\`")
    md = md.replace("${", "\\${")
    return md

# ── Insert post into blog-posts.ts ──────────────────────────────────────────
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

# ── Deploy ───────────────────────────────────────────────────────────────────
def deploy() -> None:
    os.chdir(REPO)

    subprocess.run(["git", "add", "-A"], check=True)
    subprocess.run(["git", "commit", "-m", f"Blog: batch add {BATCH_COUNT} SEO posts"], check=True)
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

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    existing = get_existing_slugs()
    print(f"Found {len(existing)} existing posts")

    topics = pick_topics(existing, BATCH_COUNT)
    print(f"Picked {len(topics)} new topics to generate (out of {BATCH_COUNT} requested)")

    if not topics:
        print("No new topics to generate — all topics already covered!")
        return

    generated = []
    failed = 0

    for i, (topic, slug) in enumerate(topics):
        print(f"\n[{i+1}/{len(topics)}] {topic['title'][:60]}...")
        post = generate_post(topic)

        if not post:
            print(f"  ❌ Failed, skipping")
            failed += 1
            time.sleep(2)  # Rate limit
            continue

        insert_post(slug, post["title"], post["description"], post["content"])
        generated.append(slug)
        print(f"  ✅ Inserted: {slug}")

        # Small delay between API calls
        if i < len(topics) - 1:
            time.sleep(3)

    print(f"\n{'='*60}")
    print(f"Generated: {len(generated)}/{len(topics)} posts")
    print(f"Failed: {failed}")
    print(f"{'='*60}")

    if DRY_RUN:
        print("\n--- DRY RUN --- Skipping deploy.")
        return

    if generated:
        deploy()
        print(f"\n🎉 Deployed {len(generated)} blog posts to {SITE}")
    else:
        print("\nNo posts generated, nothing to deploy.")

if __name__ == "__main__":
    main()