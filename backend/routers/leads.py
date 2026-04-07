from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Lead
from schemas import SaveLeadRequest, LeadResponse

router = APIRouter()

@router.get("/leads", response_model=list[LeadResponse])
def get_leads(db: Session = Depends(get_db)):
    return db.query(Lead).order_by(Lead.created_at.desc()).all()

@router.post("/leads", response_model=LeadResponse)
def save_lead(request: SaveLeadRequest, db: Session = Depends(get_db)):
    lead = Lead(
        url=request.url,
        company_name=request.company_name,
        service_type=request.service_type,
        tone=request.tone,
        profile_json=request.profile_json,
        messages_json=request.messages_json,
        explanation=request.explanation,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

@router.delete("/leads/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(lead)
    db.commit()
    return {"deleted": True}