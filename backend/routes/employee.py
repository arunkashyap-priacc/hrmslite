from fastapi import APIRouter, HTTPException
from database import db
from models import Employee
from bson import ObjectId

router = APIRouter()

# CREATE EMPLOYEE
@router.post("/")
async def create_employee(employee: Employee):
    existing = await db.employees.find_one({"employee_id": employee.employee_id})
    if existing:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    await db.employees.insert_one(employee.dict())
    return {"message": "Employee created successfully"}


# GET ALL EMPLOYEES
@router.get("/")
async def get_employees():
    employees = []
    cursor = db.employees.find()

    async for document in cursor:
        document["_id"] = str(document["_id"])   # FIX ObjectId
        employees.append(document)

    return employees


# DELETE EMPLOYEE
@router.delete("/{employee_id}")
async def delete_employee(employee_id: str):
    result = await db.employees.delete_one({"employee_id": employee_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted"}