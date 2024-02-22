import { pool } from "../db/dbConnection.js";

export const createStudent = async (req, res) => {
    try {
        const { user_id, name, age } = req.body;
        const createStudentQuery = 'INSERT INTO Students (user_id, name, age) VALUES ($1, $2, $3) RETURNING *';
        const createStudentValues = [user_id, name, age];
        const createdStudentResult = await pool.query(createStudentQuery, createStudentValues);
        const createdStudent = createdStudentResult.rows[0];
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