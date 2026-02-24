from fastapi import APIRouter, HTTPException
from database import db
from models import EmployeeCreate

router = APIRouter()


def _next_employee_id(employees):
    numeric_ids = []

    for employee in employees:
        employee_id = str(employee.get("employee_id", ""))
        if employee_id.isdigit():
            numeric_ids.append(int(employee_id))

    if not numeric_ids:
        return "101"

    return str(max(numeric_ids) + 1)


# CREATE EMPLOYEE
@router.post("/")
async def create_employee(employee: EmployeeCreate):
    all_employees = await db.employees.find({}, {"employee_id": 1}).to_list(length=None)
    employee_id = _next_employee_id(all_employees)

    payload = {
        "employee_id": employee_id,
        "full_name": employee.full_name,
        "email": employee.email,
        "department": employee.department,
    }

    await db.employees.insert_one(payload)

    return {
        "message": "Employee created successfully",
        "employee_id": employee_id,
    }


# GET ALL EMPLOYEES
@router.get("/")
async def get_employees():
    employees = []
    cursor = db.employees.find()

    async for document in cursor:
        document["_id"] = str(document["_id"])
        employees.append(document)

    return employees


# DELETE EMPLOYEE (with attendance cleanup)
@router.delete("/{employee_id}")
async def delete_employee(employee_id: str):
    result = await db.employees.delete_one({"employee_id": employee_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")

    attendance_result = await db.attendance.delete_many(
        {"employee_id": employee_id}
    )

    return {
        "message": "Employee and related attendance deleted",
        "deleted_attendance_records": attendance_result.deleted_count,
    }