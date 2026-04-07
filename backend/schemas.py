from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ── Inbound ────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    url: str
    service_type: str   # automation | chatbot | scraping | dashboard | saas_mvp
    tone: str           # casual | professional | bold

class SaveLeadRequest(BaseModel):
    url: str
    company_name: str
    service_type: str
    tone: str
    profile_json: str
    messages_json: str
    explanation: Optional[str] = None

# ── Extracted data ─────────────────────────────────────
class PainPoint(BaseModel):
    category: str    # ux | automation | content | performance | cta
    signal: str      # what was found
    severity: str    # low | medium | high

class CompanyProfile(BaseModel):
    name: str
    description: str
    what_they_do: str
    target_audience: Optional[str] = None
    pain_points: list[PainPoint] = []
    tech_stack: list[str] = []
    detected_tone: str = "professional"
    location: Optional[str] = None
    pricing_tier: str = "unknown"

# ── AI outputs ─────────────────────────────────────────
class MessageVariants(BaseModel):
    cold_dm: str
    cold_email: str
    value_led: str

# ── Responses ──────────────────────────────────────────
class AnalyzeResponse(BaseModel):
    company_profile: CompanyProfile
    messages: MessageVariants
    explanation: str

class LeadResponse(BaseModel):
    id: int
    url: str
    company_name: str
    service_type: str
    tone: str
    profile_json: str
    messages_json: str
    explanation: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True