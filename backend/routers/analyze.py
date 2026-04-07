from fastapi import APIRouter, HTTPException
from schemas import AnalyzeRequest, AnalyzeResponse

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_lead(request: AnalyzeRequest):
    # Placeholder — Phase 3 will wire in extractor + AI service
    raise HTTPException(status_code=501, detail="Not yet implemented")