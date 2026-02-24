from pydantic import BaseModel, EmailStr
from typing import Optional

class Employee(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class Attendance(BaseModel):
    employee_id: str
    date: str
    status: str