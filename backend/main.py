from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import employee, attendance

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee.router, prefix="/employees")
app.include_router(attendance.router, prefix="/attendance")