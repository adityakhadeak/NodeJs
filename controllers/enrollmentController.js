import { pool } from "../db/dbConnection.js"
import { body, param, validationResult } from "express-validator"


const isValidUser = async (user_id, student_id) => {
    const findStudentQuery = "SELECT * FROM Students WHERE user_id = $1"
    const findStudentValues = [user_id]
    const findStudentResult = await pool.query(findStudentQuery, findStudentValues)
    const foundStudent = findStudentResult.rows[0]
    
    return student_id===foundStudent.student_id
}

export const createEnrollment = async (req, res) => {
    const validationRules = [
        body('student_id', "Student id should not be empty").notEmpty().isNumeric().toInt(),
        body('course_id', "Course id should not be empty").notEmpty().isNumeric().toInt(),
        body('enrollment_date', "Date field should not be empty").notEmpty().isDate()

    ]

    await Promise.all(validationRules.map(validation => validation.run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }


    const { student_id, course_id, enrollment_date } = req.body
    try {

        if (! await isValidUser(req.user.userId, student_id))
        {
            return res.status(403).json({
                message: "Invalid User Token (Cannot authenticate seems other users deleting someones other account)",
            })
        }

        const checkEnrollPresentQuery = "SELECT * FROM Enrollments WHERE student_id = $1"
        const checkEnrollPresentValue = [student_id]
        const checkEnrollPresentResult = await pool.query(checkEnrollPresentQuery, checkEnrollPresentValue)

        const enrollPresent = checkEnrollPresentResult.rows

        const isPresent = enrollPresent.some(enroll => enroll.course_id === course_id)

        if (isPresent) {
            return res.status(200).json({
                message: "Already Enrolled"
            })
        }



        const createEnrollmentQuery = 'INSERT INTO Enrollments (student_id, course_id, enrollment_date) VALUES ($1, $2, $3) RETURNING *'
        const createEnrollmentValues = [student_id, course_id, enrollment_date]
        const createdEnrollmentResult = await pool.query(createEnrollmentQuery, createEnrollmentValues)
        const createdEnrollment = createdEnrollmentResult.rows[0]
        res.status(201).json({
            message: "student added",
            data: createdEnrollment
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

export const getEnrollments = async (req, res) => {
    try {
        const getEnrollmentsQuery = "SELECT * FROM Enrollments"
        const getEnrollmentsResult = await pool.query(getEnrollmentsQuery)
        const enrollments = getEnrollmentsResult.rows

        res.status(200).json({
            message: "Data fetched",
            data: enrollments
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

export const updateEnrollment = async (req, res) => {

    const validationRules = [
        body('student_id', "Student id should not be empty").notEmpty().isNumeric().toInt(),
        body('course_id', "Course id should not be empty").notEmpty().isNumeric().toInt,
        body('enrollment_date', "Date field should not be empty").notEmpty().isDate(),
        param('enroll_id', "Enroll ID should be numeric").isNumeric().toInt()

    ]

    await Promise.all(validationRules.map(validation => validation.run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }



    const { enroll_id } = req.params
    const { student_id, course_id, enrollment_date } = req.body

    try {
        const updateEnrollmentQuery = 'UPDATE Enrollments SET student_id = $1, course_id = $2, enrollment_date = $3 WHERE enrollment_id = $4 RETURNING *'
        const updateEnrollmentValues = [student_id, course_id, enrollment_date, enroll_id]
        const updatedEnrollmentResult = await pool.query(updateEnrollmentQuery, updateEnrollmentValues)

        if (updatedEnrollmentResult.rowCount === 0) {
            return res.status(404).json({
                message: "Enrollmnt not found"
            })
        }

        const updatedEnrollment = updatedEnrollmentResult.rows[0]

        res.status(200).json({
            message: "Enrollment details updated",
            data: updatedEnrollment
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

export const deleteEnroll = async (req, res) => {

    console.log(req.params.enroll_id)
    const validationRules = [
        param('enroll_id',"Enroll ID must be a numeric value").isNumeric().toInt()
    ]

    await Promise.all(validationRules.map(validation => validation.run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { enroll_id } = req.params

    try {
        const getEnrollQuery = "SELECT * FROM Enrollments WHERE enrollment_id = $1";
        const queryValue = [enroll_id];
        const getEnrollResult = await pool.query(getEnrollQuery, queryValue);
        if (getEnrollResult.rowCount === 0) {
            return res.status(404).json({
                message: "Enroll not Found"
            })
        }

        const deleteEnrollQuery = "DELETE FROM Enrollments WHERE enrollment_id = $1 RETURNING *";
        const deleteEnrollResult = await pool.query(deleteEnrollQuery, queryValue);
        console.log(deleteEnrollResult)
        res.status(200).json({
            message: "Enrollment deleted successfully",
            data: deleteEnrollResult.rows[0]
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}