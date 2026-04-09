from schemas import CompanyProfile

SYSTEM_PROMPT = """You are an expert B2B sales copywriter and business analyst working as a freelance positioning strategist.

Your job is to write cold outreach messages for a freelancer targeting a specific company.

ABSOLUTE RULES — violating any of these makes the output worthless:
- NEVER open with: "I hope", "I noticed", "I came across", "I wanted to reach out", "My name is", "Your site lacks", "Your website shows"
- NEVER use "we" or "our" — you are a solo freelancer, always use "I" and "my"
- NEVER use these weak asks: "Would you be open to", "Would love to chat", "Let me know if interested", "Feel free to reach out"
- NEVER write vague offers: "I can help your business", "I can improve your processes", "I can help you grow"
- NEVER sound like a template — if the message could apply to any company, rewrite it
- The value_led MUST open with a specific business insight about this company — not a comment about their website, not a greeting. Example of WRONG: "The absence of social proof on your site..." Example of RIGHT: "Most teams using Next.js for product tooling underestimate how much onboarding drop-off compounds — at Linear's stage, that's likely costing trial conversions before users hit the aha moment."
- Tone must be distinctly different based on the tone instruction — bold means provocative and direct, casual means conversational like a peer, professional means polished and credible
- The explanation must name specific signals (tech stack items, pain point categories, pricing tier) — not generic reasoning
- Return ONLY a valid JSON object — no markdown fences, no preamble, nothing outside the JSON

OUTPUT FORMAT:
{
  "cold_dm": "...",
  "cold_email": "Subject: ...\\n\\n...",
  "value_led": "...",
  "explanation": "..."
}"""


def build_user_prompt(profile: CompanyProfile, service_type: str, tone: str) -> str:

    pain_points_str = ""
    if profile.pain_points:
        lines = []
        for pp in profile.pain_points:
            lines.append(f"  - [{pp.severity.upper()}] {pp.category}: {pp.signal}")
        pain_points_str = "\n".join(lines)
    else:
        pain_points_str = "  - No specific pain points detected"

    tech_str     = ", ".join(profile.tech_stack) if profile.tech_stack else "Not detected"
    audience_str = profile.target_audience or "Not clearly identified"
    location_str = profile.location or "Not identified"

    service_contexts = {
        "automation":  "business process automation — eliminating manual workflows, connecting tools, automating data handling and reporting",
        "chatbot":     "AI chatbot and customer support automation — reducing support load with intelligent assistants trained on company knowledge",
        "scraping":    "web scraping and data collection — building data pipelines, competitor monitoring, market intelligence systems",
        "dashboard":   "business dashboards and data visualization — turning raw data into actionable visual reports and live metrics",
        "saas_mvp":    "SaaS MVP development — building the first version of a web product with authentication, APIs, databases, and core features",
    }
    service_context = service_contexts.get(service_type, service_type)

    tone_instructions = {
        "casual": """TONE: Casual and conversational — write like a peer, not a vendor.
- Use contractions (you're, it's, I've)
- Short punchy sentences
- End ask: direct and low-pressure ("Worth a 20-min call?" / "Thoughts?" / "Want me to sketch something out?")""",

        "professional": """TONE: Polished and credible — write like a senior consultant who has done this before.
- Precise language, no filler words
- Structured logic: observation → implication → offer
- End ask: confident and specific ("I'd welcome a 20-minute call to walk through how I'd approach this." / "Happy to share a brief proposal if that's useful.")""",

        "bold": """TONE: Bold and direct — write like someone who immediately sees the problem and isn't afraid to say it.
- Open with a provocative but accurate observation
- Don't soften the pitch
- No "might", "could potentially", "perhaps" — be declarative
- End ask: direct and slightly challenging ("15 minutes — I'll show you exactly what I'd build." / "One call. I'll come with a concrete plan.")""",
    }
    tone_instruction = tone_instructions.get(tone, tone_instructions["professional"])

    return f"""Generate 4 outreach outputs for a freelancer offering {service_context}.

COMPANY PROFILE:
- Name: {profile.name}
- Description: {profile.description}
- What they do: {profile.what_they_do[:300]}
- Target audience: {audience_str}
- Detected company tone: {profile.detected_tone}
- Pricing tier: {profile.pricing_tier}
- Tech stack: {tech_str}
- Location: {location_str}

PAIN POINTS DETECTED:
{pain_points_str}

FREELANCER SERVICE: {service_context}
GOAL: get a reply — start a conversation, book a discovery call

{tone_instruction}

OUTPUT INSTRUCTIONS:

cold_dm — LinkedIn or Twitter DM
- Max 60 words
- Do NOT start with a comment about their website or a greeting
- Start with a specific, surprising, or counterintuitive observation about their BUSINESS, their market position, or their growth stage
- One clean ask at the end matching the tone above

cold_email — full email with subject line
- First line: "Subject: [subject]" — subject must be specific to this company, not generic
- Blank line, then body
- Max 130 words total
- Structure: sharp observation → why it matters to them → what I offer → single ask
- Subject line must not be "Quick question" or "Opportunity for [Company]"

value_led — insight-first message
- Max 110 words  
- FIRST SENTENCE: a concrete business insight about this company's market, product stage, or competitive position — NOT a comment about their website
- Connect that insight to the service offered
- Soft but specific ask at the end

explanation — strategic reasoning
- Write in second person ("Your DM opens with X because...")
- Reference at least 2 named signals: name a specific tech, a specific pain point category, or the pricing tier
- One sentence per variant explaining the structural choice
- Max 100 words
- Sound like a strategist, not a disclaimer

Return ONLY the JSON object. Nothing else."""