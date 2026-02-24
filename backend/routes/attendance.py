from fastapi import APIRouter, HTTPException
from database import db
from models import Attendance

router = APIRouter()

# MARK ATTENDANCE
@router.post("/")
async def mark_attendance(attendance: Attendance):
    # check employee exists
    employee = await db.employees.find_one(
        {"employee_id": attendance.employee_id}
    )

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    await db.attendance.insert_one(attendance.dict())
    return {"message": "Attendance marked successfully"}


# GET ALL ATTENDANCE
@router.get("/")
async def get_attendance():
    records = []
    cursor = db.attendance.find()

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        records.append(doc)

    return records


# GET ATTENDANCE BY EMPLOYEE
@router.get("/{employee_id}")
async def get_employee_attendance(employee_id: str):
    records = []
    cursor = db.attendance.find({"employee_id": employee_id})

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        records.append(doc)

    return records