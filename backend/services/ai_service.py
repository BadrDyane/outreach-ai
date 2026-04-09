import requests
import json
import os
from dotenv import load_dotenv
from schemas import CompanyProfile, MessageVariants, AnalyzeResponse
from services.prompt_builder import build_user_prompt, SYSTEM_PROMPT

load_dotenv()

OPENAI_URL = "https://api.openai.com/v1/chat/completions"


def generate_messages(
    profile: CompanyProfile,
    service_type: str,
    tone: str,
) -> tuple[MessageVariants, str]:

    user_prompt = build_user_prompt(profile, service_type, tone)

    headers = {
        "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 1200,
    }

    try:
        response = requests.post(OPENAI_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
    except requests.exceptions.Timeout:
        raise ValueError("OpenAI API request timed out")
    except requests.exceptions.RequestException as e:
        raise ValueError(f"OpenAI API request failed: {str(e)}")

    raw = response.json()["choices"][0]["message"]["content"]

    # Strip markdown fences if present
    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
    clean = clean.strip().rstrip("```").strip()

    try:
        data = json.loads(clean)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {str(e)}\nRaw: {raw[:300]}")

    # Validate required keys
    required = ["cold_dm", "cold_email", "value_led", "explanation"]
    missing  = [k for k in required if k not in data]
    if missing:
        raise ValueError(f"AI response missing keys: {missing}")

    messages = MessageVariants(
        cold_dm    = data["cold_dm"],
        cold_email = data["cold_email"],
        value_led  = data["value_led"],
    )

    return messages, data["explanation"]