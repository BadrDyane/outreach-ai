from fastapi import APIRouter, HTTPException
from schemas import AnalyzeRequest, AnalyzeResponse
from services.extractor import extract_company_profile
from services.ai_service import generate_messages
import asyncio

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_lead(request: AnalyzeRequest):

    # Validate URL format
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=422,
            detail="URL must start with http:// or https://"
        )

    # Step 1 — extract company profile from website
    profile = await extract_company_profile(request.url)
    if not profile:
        raise HTTPException(
            status_code=422,
            detail="Could not extract data from this URL. The site may be blocking automated requests or require JavaScript rendering."
        )

    # Step 2 — generate messages + explanation
    try:
        messages, explanation = generate_messages(
            profile      = profile,
            service_type = request.service_type,
            tone         = request.tone,
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return AnalyzeResponse(
        company_profile = profile,
        messages        = messages,
        explanation     = explanation,
    )