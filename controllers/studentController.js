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
