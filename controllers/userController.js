import { pool } from "../db/dbConnection.js"
import { body, param, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {

     const validationRules = [
        body('name',"Name field cannot be empty").notEmpty().isString().escape(),
        body('username',"username cannot be empty").notEmpty().isString().escape(),
        body('email',"Enter a valid email address").notEmpty().isEmail().normalizeEmail(),
        body('password',"Password must be of atleast 7 characters").notEmpty().isString().isLength({min:7}),
        body('role_id').notEmpty().isNumeric().toInt()
    ];

    await Promise.all(validationRules.map(validation => validation.run(req)))

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { username, email, password, role_id, name, age, department } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const isUserExistQuery='SELECT * FROM Users WHERE username = $1 OR email = $2'
        const isUserExistValues=[username,email]
        const isUserExistResult=await pool.query(isUserExistQuery,isUserExistValues)

        if( isUserExistResult.rowCount!=0)
        {
            return res.status(409).json({
                message: "User with this email or username already exists"
            })
        }

        // Insert the user into the Users table
        const newUserQuery = 'INSERT INTO Users (username, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id'
        const newUserValues = [username, email, hashedPassword, role_id]
        const newUserResult = await pool.query(newUserQuery, newUserValues)
        const userId = newUserResult.rows[0].user_id

        // Insert data into the relevant table based on the user's role
        if (role_id === 25) {
            // Insert data into the Students table
            const newStudentQuery = 'INSERT INTO Students (user_id, name, age) VALUES ($1, $2, $3)'
            const newStudentValues = [userId, name, age]
            await pool.query(newStudentQuery, newStudentValues)
        } else if (role_id === 26) {
            // Insert data into the Teachers table
            const newTeacherQuery = 'INSERT INTO Teachers (user_id, name, department) VALUES ($1, $2, $3)'
            const newTeacherValues = [userId, name, department]
            await pool.query(newTeacherQuery, newTeacherValues)
        }

        const userData = {
            user: {
                userId,
                username,
                role_id
            }
        }

        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '3d' })

        res.status(201).json({
            message: "User created",
            data: {
                username: username,
                email: email,
                role_id: role_id
            },
            token: token

        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}



export const loginUser = async (req, res) => {

    const validationRules = [
        body('username',"Username cannot be empty").notEmpty().isString().escape(),
        body('password').notEmpty().isString(),
    ];

    await Promise.all(validationRules.map(validation => validation.run(req)))

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { username, password } = req.body

    try {
        const userQuery = 'SELECT * FROM Users WHERE username = $1'
        const userValues = [username]
        const userResult = await pool.query(userQuery, userValues)
        const user = userResult.rows[0]

        if (!user) {
            return res.status(401).json({ message: 'User not exists' })
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong Password' })
        }
        const userData = {
            user: {
                userId: user.user_id,
                username: user.username,
                role_id: user.role_id
            }
        }

        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '3d' })

        res.status(200).json({
            message: 'Login successful',
            token: token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}


export const getUsers = async (req, res) => {
    try {
        const getUsersQuery = 'SELECT * FROM Users'
        const usersResult = await pool.query(getUsersQuery)
        const users = usersResult.rows
        users.forEach((user)=>{
            delete user.password
        })
        res.status(200).json({
            message: "Data fetched",
            data: users
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

export const updateUserLoginDetails = async (req, res) => {


    const validationRules = [
        body('username').notEmpty().isString().escape(),
        body('email').notEmpty().isEmail().normalizeEmail(),
        body('password',"Password must be of atleast 7 characters").notEmpty().isString().isLength({min:7}),
        param('user_id', "User ID should be numeric").isNumeric().toInt()
    ];

    await Promise.all(validationRules.map(validation => validation.run(req)))

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { user_id } = req.params
    if (user_id != req.user.userId) {
        return res.status(403).json({
            message: "Invalid User Token",
        })
    }
    const { username, email, password } = req.body
    const encryptedPass = await bcrypt.hash(password, 10)
    try {
        const updateQuery = 'UPDATE Users SET username = $1, email = $2, password = $3 WHERE user_id = $4 RETURNING *'
        const updateValues = [username, email, encryptedPass, user_id]
        const updatedResult = await pool.query(updateQuery, updateValues)

        if (updatedResult.rowCount === 0) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        const updatedUser = updatedResult.rows[0]
        delete updatedUser['password']
        res.status(200).json({
            message: "User details updated",
            data: updatedUser
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

export  const deleteUser = async (req, res) => {

    const validationRules=[
        param('user_id', "User ID should be numeric").isNumeric().toInt()
    ]

    await Promise.all(validationRules.map(validation=>validation.run(req)))

    const errors=validationResult(req)

    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }

    const { user_id } = req.params
    if (user_id != req.user.userId) {
        return res.status(403).json({
            message: "Invalid User Token (Cannot authenticate seems other users deleting someones other account)",
        })
    }

    let userDetail={}
    try {
        const allUserQuery = "SELECT * FROM Users WHERE user_id = $1";
        const queryValue=[user_id];
        const allUserResult= await pool.query(allUserQuery,queryValue);
        if(allUserResult.rowCount===0 )
        {
           return  res.status(404).json({
                message:"User not Found"
            })
        }
        const role_id=allUserResult.rows[0].role_id;

        if(role_id==25)
        {
            const deleteStudentQuery = "DELETE FROM Students WHERE user_id = $1 RETURNING *";
            const deleteStudentResult = await pool.query(deleteStudentQuery,queryValue);
            userDetail={...userDetail,...deleteStudentResult.rows[0]}
        }
        else if(role_id==27)
        {
            const deleteTeacherQuery = "DELETE FROM Teachers WHERE user_id = $1 RETURNING *";
            const deleteTeacherResult = await pool.query(deleteTeacherQuery,queryValue);
            userDetail={...userDetail,...deleteTeacherResult.rows[0]}
        }

        const deleteUserQuery="DELETE FROM Users WHERE user_id = $1 RETURNING *";
        const deleteUserResult = await pool.query(deleteUserQuery,queryValue);
        userDetail={...userDetail,...deleteUserResult.rows[0]}
        delete userDetail["password"]
        res.status(200).json({
            message:"User deleted successfully",
            data:userDetail
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}