from pydantic import BaseModel, EmailStr


class EmployeeCreate(BaseModel):
    full_name: str
    email: EmailStr
    department: str


class Employee(EmployeeCreate):
    employee_id: str


class Attendance(BaseModel):
    employee_id: str
    date: str
    status: str