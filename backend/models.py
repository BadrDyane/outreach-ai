from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    service_type = Column(String, nullable=False)
    tone = Column(String, nullable=False)
    profile_json = Column(Text, nullable=False)
    messages_json = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)