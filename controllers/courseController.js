import { pool } from "../db/dbConnection.js"  
import { body,validationResult } from "express-validator"

export const createCourse = async (req, res) => {

    const validationRules=[
        body('course_name',"Course id should not be empty").notEmpty().isNumeric(),
        body('description',"Description should not be empty").notEmpty().isNumeric(),
        body('teacher_id',"Teacher id  should not be empty").notEmpty().isDate()
    ]

    await Promise.all(validationRules.map(validation=>validation.run(req)))

    const errors=validationResult(req)

    if(!errors.isEmpty())
    {
        res.status(400).json({errors:errors.array()})
    }

    const { course_name, description, teacher_id } = req.body  
    try {
        const createCourseQuery = 'INSERT INTO Courses (course_name, description, teacher_id) VALUES ($1, $2, $3) RETURNING *'  
        const createCourseValues = [course_name, description, teacher_id]  
        const createdCourseResult = await pool.query(createCourseQuery, createCourseValues)  
        const createdCourse = createdCourseResult.rows[0]  
        res.json(createdCourse)  
    } catch (error) {
        console.error(error)  
        res.status(500).json({
            message: "Internal server error",
            error
        })  
    }
}  

// fetchAll courses
export const getCourses = async (req, res) => {
    try {
        const getAllCoursesQuery = 'SELECT * FROM Courses'  
        const coursesResult = await pool.query(getAllCoursesQuery)  
        const courses = coursesResult.rows  

        res.json({
            message: "Data fetched",
            data: courses
        })  
    } catch (error) {
        console.error(error)  
        res.status(500).json({
            message: "Internal server error",
            error
        })  
    }
}  

export const updateCourse = async (req, res) => {
    const { course_id } = req.params  
    const { course_name, description, teacher_id } = req.body  

    try {
        const updateCourseQuery = 'UPDATE Courses SET course_name = $1, description = $2, teacher_id = $3 WHERE course_id = $4 RETURNING *'  
        const updateCourseValues = [course_name, description, teacher_id, course_id]  
        const updatedCourseResult = await pool.query(updateCourseQuery, updateCourseValues)  

        if (updatedCourseResult.rowCount === 0) {
            return res.status(404).json({
                message: "Course not found"
            })  
        }

        const updatedCourse = updatedCourseResult.rows[0]  

        res.status(200).json({
            message: "Course details updated",
            data: updatedCourse
        })  
    } catch (error) {
        console.error(error)  
        res.status(500).json({
            message: "Internal server error",
            error: error
        })  
    }
}  


export  const deleteCourse = async (req, res) => {
    const { course_id } = req.params
    try {
        const getCourseQuery = "SELECT * FROM Courses WHERE course_id = $1";
        const queryValue=[course_id];
        const getCourseResult= await pool.query(getCourseQuery,queryValue);
        if(getCourseResult.rowCount===0 )
        {
           return  res.status(404).json({
                message:"Course not Found"
            })
        }

        const deleteCourseQuery="DELETE FROM  Courses WHERE course_id = $1 RETURNING *";
        const deleteCourseResult = await pool.query(deleteCourseQuery,queryValue);
        res.status(200).json({
            message:"Course deleted successfully",
            data:deleteCourseResult.rows[0]
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}