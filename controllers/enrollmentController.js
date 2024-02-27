import { pool } from "../db/dbConnection.js"  

export const createEnrollment = async (req, res) => {
    const { student_id, course_id, enrollment_date } = req.body  
    try {
        const createEnrollmentQuery = 'INSERT INTO Enrollments (student_id, course_id, enrollment_date) VALUES ($1, $2, $3) RETURNING *'  
        const createEnrollmentValues = [student_id, course_id, enrollment_date]  
        const createdEnrollmentResult = await pool.query(createEnrollmentQuery, createEnrollmentValues)  
        const createdEnrollment = createdEnrollmentResult.rows[0]  
        res.status(200).json({
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

export  const deleteEnroll = async (req, res) => {
    const { enroll_id } = req.params
    console.log(enroll_id)
    try {
        const getEnrollQuery = "SELECT * FROM Enrollments WHERE enrollment_id = $1";
        const queryValue=[enroll_id];
        const getEnrollResult= await pool.query(getEnrollQuery,queryValue);
        if(getEnrollResult.rowCount===0 )
        {
           return  res.status(404).json({
                message:"Enroll not Found"
            })
        }

        const deleteEnrollQuery="DELETE FROM Enrollments WHERE enrollment_id = $1 RETURNING *";
        const deleteEnrollResult = await pool.query(deleteEnrollQuery,queryValue);
        console.log(deleteEnrollResult)
        res.status(200).json({
            message:"Enrollment deleted successfully",
            data:deleteEnrollResult.rows[0]
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}