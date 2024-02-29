import { validationResult,body } from "express-validator";
import { pool } from "../db/dbConnection.js";

export const createStudent = async (req, res) => {
    try {
        const { user_id, name, age } = req.body;
        const createStudentQuery = 'INSERT INTO Students (user_id, name, age) VALUES ($1, $2, $3) RETURNING *'
        const createStudentValues = [user_id, name, age];
        const createdStudentResult = await pool.query(createStudentQuery, createStudentValues)
        const createdStudent = createdStudentResult.rows[0]
        res.status(200).json({
            message: "student added",
            data: createdStudent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

export const getStudents = async (req, res) => {
    try {
        const getStudentsQuery = 'SELECT * FROM Students'
        const studentsResult = await pool.query(getStudentsQuery)
        const students = studentsResult.rows
        res.status(200).json({
            message: "Data fetched",
            data: students
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

export const updateStudent = async (req, res) => {
console.log(typeof req.body.age)
    const validationRules=[
        body('name',"Name cannot be empty").notEmpty().isString(),
        body('age',"Age field cannot be empty").notEmpty().isNumeric(),
        body('age',"Age must be a number").isNumeric()
    ]

    await Promise.all(validationRules.map(validation=>validation.run(req)))

    const errors=validationResult(req)

    if(!errors.isEmpty())
    {
       return res.status(400).json({errors:errors.array()})
    }

    const { student_id } = req.params
    const { name, age } = req.body

    try {
        const updateStudentQuery = 'UPDATE Students SET  name = $1, age = $2 WHERE student_id = $3 RETURNING *'
        const updateStudentValues = [name, age, student_id];
        const updatedStudentResult = await pool.query(updateStudentQuery, updateStudentValues)
      
        if (updatedStudentResult.rowCount === 0) {
            return res.status(404).json({
                message: "Student not found",
            });
        }
      
        const updatedStudent = updatedStudentResult.rows[0]

        res.status(200).json({
            message: "Student deatils updated",
            data: updatedStudent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
};
