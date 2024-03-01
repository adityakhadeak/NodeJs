import { pool } from "../db/dbConnection.js";
import { body,validationResult } from "express-validator";
export const createRole = async (req, res) => {

    const validationRules=[
        body('role_name',"Role Name field cannot be empty").notEmpty().isString().escape(),
        body('description',"Description cannot be empty").notEmpty().isString().escape()
    ]

    await Promise.all(validationRules.map((validation)=>validation.run(req)))
    
    const errors=validationResult(req)

    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const { role_name, description } = req.body;
    console.log(req.body)
    try {
        const createRoleQuery = 'INSERT INTO Roles (role_name, description) VALUES ($1, $2) RETURNING *';
        const createRoleValues = [role_name, description];
        const createdRoleResult = await pool.query(createRoleQuery, createRoleValues);
        const createdRole = createdRoleResult.rows[0];
        res.status(200).json({
            message: "Role created",
            data: createdRole
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

export const getRoles=async(req,res)=>{
    try {
        const getRolesQuery="SELECT * FROM Roles"
        const getRolesResult=await pool.query(getRolesQuery)
        const roles=getRolesResult.rows

        res.status(200).json({
            message:"Data fetched",
            data:roles
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}