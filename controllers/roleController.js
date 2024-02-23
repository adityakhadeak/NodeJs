import { pool } from "../db/dbConnection.js";

export const createRole = async (req, res) => {
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