import { pool } from "../db/dbConnection.js";


export const createTeacher = async (req, res) => {
    try {
        const { user_id, name, department } = req.body;
        // Placeholder logic: Insert new teacher into the database
        const createTeacherQuery = 'INSERT INTO Teachers (user_id, name, department) VALUES ($1, $2, $3) RETURNING *';
        const createTeacherValues = [user_id, name, department];
        const createdTeacherResult = await pool.query(createTeacherQuery, createTeacherValues);
        const createdTeacher = createdTeacherResult.rows[0];
        res.status(200).json({
            message: "teacher addded",
            data: createdTeacher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

export const getTeachers = async (req, res) => {
    try {
        const getTeachersQuery = 'SELECT * FROM Teachers';
        const teachersResult = await pool.query(getTeachersQuery);
        const teachers = teachersResult.rows;
        res.status(200).json({
            message: "Data fetched",
            data: teachers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};