import pkg from 'pg';
const { Pool } = pkg;
export const pool= new Pool({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"2915",
    database:"educationalsystem"
})

