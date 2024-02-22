import { pool } from "../db/dbConnection.js";
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    const { username, email, password, role_id, name, age, department } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the Users table
        const newUserQuery = 'INSERT INTO Users (username, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id';
        const newUserValues = [username, email, hashedPassword, role_id];
        const newUserResult = await pool.query(newUserQuery, newUserValues);
        const userId = newUserResult.rows[0].user_id;

        // Insert data into the relevant table based on the user's role
        if (role_id === 25) {
            // Insert data into the Students table
            const newStudentQuery = 'INSERT INTO Students (user_id, name, age) VALUES ($1, $2, $3)';
            const newStudentValues = [userId, name, age];
            await pool.query(newStudentQuery, newStudentValues);
        } else if (role_id === 26) {
            // Insert data into the Teachers table
            const newTeacherQuery = 'INSERT INTO Teachers (user_id, name, department) VALUES ($1, $2, $3)';
            const newTeacherValues = [userId, name, department];
            await pool.query(newTeacherQuery, newTeacherValues);
        }

        res.status(200).json({
            message: "User created",
            data: {
                username: username,
                email: email,
                role_id: role_id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
};
