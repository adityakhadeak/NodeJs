import { body, param, validationResult } from "express-validator"
import { pool } from "../db/dbConnection.js"


export const createTeacher = async (req, res) => {
    try {
        const { user_id, name, department } = req.body
        // Placeholder logic: Insert new teacher into the database
        const createTeacherQuery = 'INSERT INTO Teachers (user_id, name, department) VALUES ($1, $2, $3) RETURNING *'
        const createTeacherValues = [user_id, name, department]
        const createdTeacherResult = await pool.query(createTeacherQuery, createTeacherValues)
        const createdTeacher = createdTeacherResult.rows[0]
        res.status(201).json({
            message: "teacher addded",
            data: createdTeacher
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

export const getTeachers = async (req, res) => {
    try {
        const getTeachersQuery = 'SELECT * FROM Teachers'
        const teachersResult = await pool.query(getTeachersQuery)
        const teachers = teachersResult.rows
        res.status(200).json({
            message: "Data fetched",
            data: teachers
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

export const updateTeacher = async (req, res) => {

    const validationRules = [
        body('name', "Name cannot be empty").notEmpty().isString().escape(),
        body('department', "Department field cannot be empty").notEmpty().isString().escape(),
        param('teacher_id',"Teacher Id must be numeric value").isNumeric().toInt()
    ]

    await Promise.all(validationRules.map(validation => validation.run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { teacher_id } = req.params
    const { name, department } = req.body

    try {
        const updateTeacherQuery = 'UPDATE Teachers SET name = $1, department = $2 WHERE teacher_id = $3 RETURNING *'
        const updateTeacherValues = [name, department, teacher_id]
        const updatedTeacherResult = await pool.query(updateTeacherQuery, updateTeacherValues)

        if (updatedTeacherResult.rowCount === 0) {
            return res.status(404).json({
                message: "Teacher not found"
            })
        }

        const updatedTeacher = updatedTeacherResult.rows[0]

        res.status(200).json({
            message: "Teacher details updated",
            data: updatedTeacher
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
} 
