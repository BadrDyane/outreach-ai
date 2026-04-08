import httpx
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from schemas import CompanyProfile, PainPoint
from utils.tech_detector import detect_tech_stack

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


async def extract_company_profile(url: str) -> CompanyProfile | None:
    try:
        async with httpx.AsyncClient(
            timeout=15,
            follow_redirects=True,
            headers=HEADERS,
        ) as client:
            response = await client.get(url)

        if response.status_code >= 400:
            return None

        html     = response.text
        soup     = BeautifulSoup(html, "html.parser")

        for tag in soup(["script", "style", "noscript", "svg", "path"]):
            tag.decompose()

        name        = _extract_name(soup, url)
        description = _extract_description(soup)
        headings    = _extract_headings(soup)
        body_text   = _extract_body_text(soup)
        combined    = " ".join(headings) + " " + body_text

        return CompanyProfile(
            name            = name,
            description     = description,
            what_they_do    = _summarize_what_they_do(headings, body_text),
            target_audience = _extract_audience(combined),
            pain_points     = _detect_pain_points(soup, headings, body_text, html),
            tech_stack      = detect_tech_stack(html, dict(response.headers)),
            detected_tone   = _detect_tone(combined),
            location        = _extract_location(soup, body_text),
            pricing_tier    = _detect_pricing_tier(body_text),
        )

    except Exception:
        return None


# ── Name ───────────────────────────────────────────────────────
def _extract_name(soup, url: str) -> str:
    og = soup.find("meta", property="og:site_name")
    if og and og.get("content", "").strip():
        return og["content"].strip()

    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.text.strip()
        for sep in ["|", "–", "-", "—", "·", "•"]:
            if sep in title:
                return title.split(sep)[0].strip()
        return title[:60]

    domain = urlparse(url).netloc.replace("www.", "")
    return domain.split(".")[0].title()


# ── Description ────────────────────────────────────────────────
def _extract_description(soup) -> str:
    for attr in [{"name": "description"}, {"property": "og:description"}]:
        tag = soup.find("meta", attrs=attr)
        if tag and tag.get("content", "").strip():
            return tag["content"].strip()[:300]
    return ""


# ── Headings — deduplicated ────────────────────────────────────
def _extract_headings(soup) -> list[str]:
    seen = set()
    headings = []
    for tag in soup.find_all(["h1", "h2", "h3"])[:25]:
        text = tag.get_text(separator=" ", strip=True)
        normalized = text.lower().strip()
        if len(text) > 5 and normalized not in seen:
            seen.add(normalized)
            headings.append(text)
    return headings[:15]


# ── Body text ──────────────────────────────────────────────────
def _extract_body_text(soup) -> str:
    for tag in soup(["nav", "footer", "header", "aside"]):
        tag.decompose()
    text    = soup.get_text(separator=" ", strip=True)
    cleaned = " ".join(text.split())
    return cleaned[:5000]


# ── What they do ───────────────────────────────────────────────
def _summarize_what_they_do(headings: list[str], body: str) -> str:
    h1s        = headings[:3]
    first_body = body[:400]
    combined   = " | ".join(h1s) + " — " + first_body
    return combined[:500]


# ── Target audience — tightened patterns ──────────────────────
def _extract_audience(text: str) -> str | None:
    import re

    # Only match known, specific audience categories — reject anything else
    KNOWN_AUDIENCES = [
        "startups", "startup", "small businesses", "small business",
        "enterprise", "agencies", "agency", "freelancers", "freelancer",
        "developers", "development teams", "product teams", "founders",
        "e-commerce brands", "ecommerce brands", "restaurants", "clinics",
        "saas companies", "b2b companies",
    ]

    patterns = [
        r"\bfor\s+([\w\s\-]{3,30}?)\s+(?:who|that|to |with )",
        r"\bbuilt for\s+([\w\s]{4,25})\b",
        r"\bdesigned for\s+([\w\s]{4,25})\b",
        r"\btrusted by\s+([\w\s]{4,25})\b",
        r"\bused by\s+([\w\s]{4,25})\b",
    ]

    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            result = match.group(1).strip()
            # Only accept if it matches a known audience type
            if any(known in result for known in KNOWN_AUDIENCES):
                return result.title()

    return None


# ── Tone ───────────────────────────────────────────────────────
def _detect_tone(text: str) -> str:
    text_lower = text.lower()

    startup_signals = [
        "ship", "launch", "scale", "traction", "mvp",
        "iterate", "pivot", "seed", "series a", "product-led"
    ]
    casual_signals = [
        "hey", "we're", "you're", "awesome", "super easy",
        "cool", "grab", "hop on", "let's go"
    ]
    professional_signals = [
        "enterprise", "solutions", "leverage", "comprehensive",
        "industry-leading", "our clients", "trusted by", "proven results"
    ]

    scores = {
        "startup":      sum(1 for w in startup_signals if w in text_lower),
        "casual":       sum(1 for w in casual_signals if w in text_lower),
        "professional": sum(1 for w in professional_signals if w in text_lower),
    }
    return max(scores, key=scores.get)


# ── Location ───────────────────────────────────────────────────
def _extract_location(soup, body: str) -> str | None:
    import re

    address = soup.find("address")
    if address:
        return address.get_text(strip=True)[:100]

    patterns = [
        r"(?:based|located|headquartered)\s+in\s+([A-Z][a-zA-Z\s,]{3,35})",
        r"([A-Z][a-z]+,\s*(?:CA|NY|TX|FL|WA|UK|US|Australia|Canada|Germany|France|India))",
    ]
    for pattern in patterns:
        match = re.search(pattern, body)
        if match:
            return match.group(1).strip()
    return None


# ── Pricing tier ───────────────────────────────────────────────
def _detect_pricing_tier(text: str) -> str:
    text_lower = text.lower()
    if any(s in text_lower for s in ["enterprise", "custom pricing", "contact sales", "request a quote"]):
        return "premium"
    if any(s in text_lower for s in ["free plan", "free forever", "starting at $", "no credit card"]):
        return "budget"
    if any(s in text_lower for s in ["pro plan", "business plan", "per month", "/mo", "per seat"]):
        return "mid"
    return "unknown"


# ── Pain point detection — deduplicated by category ───────────
def _detect_pain_points(soup, headings: list, body: str, html: str) -> list[PainPoint]:
    pain_points  = []
    used_cats    = set()   # ← prevents duplicate categories
    body_lower   = body.lower()

    def add(pp: PainPoint):
        # Allow max one pain point per category
        if pp.category not in used_cats:
            pain_points.append(pp)
            used_cats.add(pp.category)

    # ── UX / Social proof ────────────────────────────────────
    social_proof_signals = [
        "testimonial", "review", "rating", "stars", "trusted by",
        "customers say", "clients say", "what our", "g2", "capterra", "trustpilot"
    ]
    if not any(s in body_lower for s in social_proof_signals):
        add(PainPoint(
            category="ux",
            signal="No visible social proof, testimonials, or trust signals detected on the page.",
            severity="medium"
        ))

    # ── CTA analysis ─────────────────────────────────────────
    cta_tags    = soup.find_all(["a", "button"], limit=60)
    cta_texts   = [t.get_text(strip=True).lower() for t in cta_tags if t.get_text(strip=True)]
    strong_ctas = {"get started", "try for free", "start free trial", "book a demo",
                   "sign up", "watch demo", "see pricing", "start for free"}
    strong_count = sum(1 for c in cta_texts if any(s in c for s in strong_ctas))

    no_free_trial = not any(s in body_lower for s in ["free trial", "try for free", "free plan", "no credit card"])
    no_demo       = not any(s in body_lower for s in ["book a demo", "watch demo", "request demo", "schedule a call"])

    if strong_count == 0 and no_free_trial and no_demo:
        add(PainPoint(
            category="cta",
            signal="No strong conversion CTAs, free trial, or demo offer detected. High-friction entry point.",
            severity="high"
        ))
    elif no_free_trial and no_demo:
        add(PainPoint(
            category="cta",
            signal="No free trial or demo offer visible. May be reducing top-of-funnel conversion.",
            severity="medium"
        ))

    # ── Automation gaps ──────────────────────────────────────
    automation_gaps = [
        "email us", "fill out a form", "call us to",
        "manually", "spreadsheet", "we will get back to you", "our team will contact"
    ]
    found_gaps = [s for s in automation_gaps if s in body_lower]
    if found_gaps:
        add(PainPoint(
            category="automation",
            signal=f"Manual process signals detected: {', '.join(found_gaps[:3])}.",
            severity="high" if len(found_gaps) >= 2 else "medium"
        ))

    # ── Content depth ────────────────────────────────────────
    no_faq        = "faq" not in body_lower and "frequently asked" not in body_lower
    no_case_study = not any(s in body_lower for s in ["case study", "success story", "how we helped"])
    thin_content  = len(body.split()) < 300

    if thin_content:
        add(PainPoint(
            category="content",
            signal="Very thin page content (under 300 words). Limited trust-building and SEO value.",
            severity="medium"
        ))
    elif no_faq and no_case_study:
        add(PainPoint(
            category="content",
            signal="No FAQ section or case studies detected. Missing content that typically reduces sales friction.",
            severity="low"
        ))

    # ── Performance ──────────────────────────────────────────
    heavy_stack = (
        ("wp-content/themes" in html.lower() or "wp-includes/js" in html.lower()) and
        "jquery" in html.lower()
    )
    if heavy_stack:
        add(PainPoint(
            category="performance",
            signal="WordPress with jQuery detected. Often associated with slower load times and plugin bloat.",
            severity="low"
        ))

    return pain_points[:6]