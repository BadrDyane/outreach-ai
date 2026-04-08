import asyncio
from services.extractor import extract_company_profile

TEST_URLS = [
    "https://stripe.com",
    "https://basecamp.com",
    "https://www.shopify.com",
    "https://linear.app",
    "https://notion.so",
]

async def main():
    for url in TEST_URLS:
        print(f"\n{'='*60}")
        print(f"URL: {url}")
        print('='*60)
        profile = await extract_company_profile(url)
        if not profile:
            print("FAILED — could not extract data")
            continue

        print(f"Name:         {profile.name}")
        print(f"Tone:         {profile.detected_tone}")
        print(f"Pricing:      {profile.pricing_tier}")
        print(f"Audience:     {profile.target_audience}")
        print(f"Location:     {profile.location}")
        print(f"Tech stack:   {profile.tech_stack}")
        print(f"Description:  {profile.description[:120]}...")
        print(f"What they do: {profile.what_they_do[:150]}...")
        print(f"\nPain points ({len(profile.pain_points)}):")
        for pp in profile.pain_points:
            print(f"  [{pp.severity.upper()}] {pp.category}: {pp.signal}")

asyncio.run(main())