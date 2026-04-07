from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import analyze, leads

app = FastAPI(title="OutreachAI", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://portfolio-sigma-beryl-11.vercel.app",  # update with your Vercel URL later
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"status": "OutreachAI backend running"}

app.include_router(analyze.router, prefix="/api")
app.include_router(leads.router, prefix="/api")