import asyncio
import json
from services.extractor import extract_company_profile
from services.ai_service import generate_messages

TEST_CASES = [
    {
        "url":          "https://stripe.com",
        "service_type": "automation",
        "tone":         "bold",
    },
    {
        "url":          "https://linear.app",
        "service_type": "saas_mvp",
        "tone":         "casual",
    },
    {
        "url":          "https://notion.so",
        "service_type": "chatbot",
        "tone":         "professional",
    },
]


async def main():
    for case in TEST_CASES:
        print(f"\n{'='*65}")
        print(f"URL:     {case['url']}")
        print(f"Service: {case['service_type']}  |  Tone: {case['tone']}")
        print('='*65)

        profile = await extract_company_profile(case["url"])
        if not profile:
            print("FAILED — extraction returned None")
            continue

        try:
            messages, explanation = generate_messages(
                profile      = profile,
                service_type = case["service_type"],
                tone         = case["tone"],
            )
        except ValueError as e:
            print(f"AI ERROR: {e}")
            continue

        print(f"\n--- COLD DM ({len(messages.cold_dm.split())} words) ---")
        print(messages.cold_dm)

        print(f"\n--- COLD EMAIL ({len(messages.cold_email.split())} words) ---")
        print(messages.cold_email)

        print(f"\n--- VALUE-LED ({len(messages.value_led.split())} words) ---")
        print(messages.value_led)

        print(f"\n--- EXPLANATION ---")
        print(explanation)


asyncio.run(main())