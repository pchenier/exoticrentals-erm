#!/usr/bin/env python3
"""
SEO Blog Auto-Generator for exoticrentalsmontreal.com (v2, Sept 2026)
Generates one validated blog post daily and pushes to production.
Quality gates live in hermes-blog-lib.py (fleet block, link whitelist,
dash scrubbers, pre-publish validation).

Usage:
  python3 hermes-seo-blog.py           # generate and deploy
  python3 hermes-seo-blog.py --dry-run # generate only, don't deploy
"""

import re
import sys
import urllib.error
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from hermes_blog_lib import (
    REPO, SITE, get_existing_slugs,
    slugify, cached_whitelist, generate_post, insert_post, pick_image, DAILY_MODEL,
)

DRY_RUN = "--dry-run" in sys.argv

# ── Blog Topics ─────────────────────────────────────────────────────────────
# Fleet-verified Sept 2026. Ghost cars removed. Model field references a
# showcase /fleet/<slug> or bookable /cars/<slug> page, or None.
TOPICS = [
    # Brand + model specific (current fleet)
    {"kw": "Lamborghini Huracan Tecnica rental Montreal", "title": "Lamborghini Huracan Tecnica Rental Montreal: The V10 at Its Peak", "model": "lamborghini-huracan-tecnica", "angle": "review"},
    {"kw": "Lamborghini Huracan EVO rental Montreal", "title": "Lamborghini Huracan EVO Rental Montreal: V10 Drama on Every Street", "model": "lamborghini-huracan-evo", "angle": "review"},
    {"kw": "Lamborghini Urus rental Montreal", "title": "Lamborghini Urus Rental Montreal: The Super SUV That Rules the Road", "model": None, "angle": "review"},
    {"kw": "McLaren 600LT rental Montreal", "title": "McLaren 600LT Rental Montreal: Pure Supercar Adrenaline", "model": None, "angle": "experience"},
    {"kw": "Mercedes G63 AMG rental Montreal", "title": "Mercedes G63 AMG Rental Montreal: The Iconic G-Wagon Experience", "model": "mercedes-g63-amg", "angle": "review"},
    {"kw": "Maybach rental Montreal", "title": "Mercedes-Maybach S680 Rental Montreal: The Virgil Abloh Edition", "model": "mercedes-maybach-s680-virgil-abloh", "angle": "review"},
    {"kw": "Bentley Bentayga rental Montreal", "title": "Bentley Bentayga Rental Montreal: British Luxury SUV in Quebec", "model": "bentley-bentayga", "angle": "review"},
    {"kw": "Audi RS7 rental Montreal", "title": "Audi RS7 Rental Montreal: The Sleeper Sedan That Wakes Up Montreal", "model": "audi-rs7", "angle": "review"},
    {"kw": "BMW M4 Competition rental Montreal", "title": "BMW M4 Competition Rental Montreal: Track-Day Precision on City Streets", "model": "bmw-m4-competition", "angle": "review"},
    {"kw": "Porsche Macan GTS rental Montreal", "title": "Porsche Macan GTS Rental Montreal: The Compact SUV That Drives Like a Sports Car", "model": "porsche-macan-gts", "angle": "review"},
    {"kw": "Porsche Panamera GTS rental Montreal", "title": "Porsche Panamera GTS Rental Montreal: Four-Door Grand Touring", "model": "porsche-panamera-gts", "angle": "review"},
    {"kw": "BMW M3 Competition rental Montreal", "title": "BMW M3 Competition Rental Montreal: The Everyday Supercar Sedan", "model": "bmw-m3-competition", "angle": "review"},
    {"kw": "Mercedes GLC63s rental Montreal", "title": "Mercedes GLC63s AMG Rental Montreal: The Sharpest Compact SUV", "model": "mercedes-glc63s-amg", "angle": "review"},
    {"kw": "Cadillac Escalade rental Montreal", "title": "Cadillac Escalade Rental Montreal: The Statement SUV for Groups and Events", "model": "cadillac-escalade", "angle": "review"},
    {"kw": "Audi R8 rental Montreal", "title": "Audi R8 V10 Rental Montreal: The Last Naturally Aspirated V10", "model": None, "angle": "experience"},
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
    {"kw": "photoshoot car rental Montreal exotic", "title": "Photoshoot Car Rental Montreal: Supercars for Film and Photo", "model": None, "angle": "occasion"},
    {"kw": "birthday exotic car rental Montreal", "title": "Birthday Exotic Car Rental Montreal: The Ultimate Gift", "model": None, "angle": "occasion"},
    {"kw": "corporate luxury car rental Montreal", "title": "Corporate Exotic Car Rental Montreal: Impress Clients and Executives", "model": None, "angle": "occasion"},
    # Seasonal / general
    {"kw": "best exotic car rental Montreal 2026", "title": "Best Exotic Car Rental Montreal 2026: The Complete Guide", "model": None, "angle": "guide"},
    {"kw": "how much does it cost to rent a Lamborghini in Montreal", "title": "How Much Does It Cost to Rent a Lamborghini in Montreal?", "model": None, "angle": "guide"},
    {"kw": "exotic car rental insurance Quebec", "title": "Exotic Car Rental Insurance Quebec: What You Need to Know", "model": None, "angle": "guide"},
    {"kw": "exotic car rental deposit Montreal", "title": "Exotic Car Rental Deposit Montreal: What to Expect", "model": None, "angle": "guide"},
    # French content for bilingual SEO
    {"kw": "location voiture exotique Montreal", "title": "Location Voiture Exotique Montreal: Supercars Livrees a Votre Porte", "model": None, "angle": "french"},
    {"kw": "location Lamborghini Montreal", "title": "Location Lamborghini Montreal: Huracan Tecnica et Urus Disponibles", "model": "lamborghini-huracan-tecnica", "angle": "french"},
    {"kw": "louer McLaren Montreal", "title": "Louer McLaren Montreal: Le 600LT Vous Attend", "model": None, "angle": "french"},
    {"kw": "location SUV de luxe Montreal", "title": "Location SUV de Luxe Montreal: Urus, G63 et Maybach", "model": None, "angle": "french"},
]

# Topics retired with the old fleet (Sept 2026). Never regenerate these.
RETIRED_TOPICS = {
    "Lamborghini Huracan rental Montreal", "Ferrari 488 GTB rental Montreal",
    "Porsche 911 Techart rental Montreal", "Mercedes E63S AMG rental Montreal",
    "Luxury SUV Rental Montreal: Urus, G63, and More", "Location Ferrari Montreal",
}

# ── Step 1: Pick a topic ────────────────────────────────────────────────────
def pick_topic(existing_slugs: set) -> dict:
    """Pick the next topic that hasn't been written yet.
    Falls back to batch topics when this list is exhausted."""
    for topic in TOPICS:
        if topic["kw"] in RETIRED_TOPICS or topic["title"] in RETIRED_TOPICS:
            continue
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
                    kw_match = re.search(rf'"kw":\s*"([^"]+)"[^}}]*"title":\s*"{re.escape(title)}"[^}}]*"angle":\s*"([^"]+)"', topics_block)
                    if kw_match:
                        return {"kw": kw_match.group(1), "title": title, "model": None, "angle": kw_match.group(2)}
    except Exception:
        pass

    # All topics done — DO NOT publish a duplicate. Fail loudly so the
    # Batch Refill cron (Sundays) gets alerted.
    print("❌ All topics exhausted. Refill NEW_TOPICS in hermes-seo-blog-batch.py — no duplicate will be published.")
    sys.exit(1)


# ── Main ────────────────────────────────────────────────────────────────────
def main():
    existing = get_existing_slugs()
    print(f"Found {len(existing)} existing posts")

    _ = cached_whitelist()  # fetch once, fail early if sitemap unreachable

    topic = pick_topic(existing)
    slug = slugify(topic["title"])
    print(f"Selected topic: {topic['title']}")
    print(f"Slug: {slug}")
    print(f"Keyword: {topic['kw']}")
    print(f"Angle: {topic['angle']}")

    post = generate_post(topic, model=DAILY_MODEL)
    print(f"Generated post: {post['title'][:60]}...")
    print(f"Content length: {len(post['content'])} chars")

    image = pick_image(topic["title"] + " " + topic["kw"])

    if DRY_RUN:
        print("\n--- DRY RUN ---")
        print(f"Title: {post['title']}")
        print(f"Description: {post['description']}")
        print(f"Image: {image}")
        print(f"Content preview:\n{post['content'][:500]}...")
        print("\nSkipping insert and deploy.")
        return

    insert_post(slug, post["title"], post["description"], post["content"], image=image)

    commit_msg = f"Blog: auto-add '{slug}'"
    deploy(commit_msg)
    print(f"\n🎉 Blog post published: {slug}")


def deploy(commit_msg: str) -> None:
    import json as j
    import os
    import subprocess
    import urllib.request

    os.chdir(REPO)
    subprocess.run(["git", "add", "-A"], check=True)
    subprocess.run(["git", "commit", "-m", commit_msg], check=True)
    subprocess.run(["git", "pull", "--rebase", "origin", "main"], check=True)
    subprocess.run(["git", "push", "origin", "main"], check=True)

    result = subprocess.run(["vercel", "--prod"], capture_output=True, text=True, timeout=300)
    print(result.stdout[-200:] if len(result.stdout) > 200 else result.stdout)

    auth_file = Path("/Users/pogod/Library/Application Support/com.vercel.cli/auth.json")
    auth_data = j.loads(auth_file.read_text())
    token = auth_data["token"]
    repo_json = j.loads((REPO / ".vercel" / "repo.json").read_text())
    project_id = repo_json["projects"][0]["id"]

    url = f"https://api.vercel.com/v6/deployments?projectId={project_id}&limit=1"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        deployments = j.loads(resp.read().decode())
    deploy_uid = deployments["deployments"][0]["uid"]

    for domain in [SITE, f"www.{SITE}"]:
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


if __name__ == "__main__":
    main()