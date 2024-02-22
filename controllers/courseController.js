import { pool } from "../db/dbConnection.js";

export const createCourse = async (req, res) => {
    const { course_name, description, teacher_id } = req.body;
    try {
        const createCourseQuery = 'INSERT INTO Courses (course_name, description, teacher_id) VALUES ($1, $2, $3) RETURNING *';
        const createCourseValues = [course_name, description, teacher_id];
        const createdCourseResult = await pool.query(createCourseQuery, createCourseValues);
        const createdCourse = createdCourseResult.rows[0];
        res.json(createdCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};
