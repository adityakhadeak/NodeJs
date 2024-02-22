import express from 'express'

const app=express();

app.use(express.json())

app.get('/users',(req,res)=>{
    res.send({
        info:"Hello there"
    })
})

app.listen(3000,()=>{
    console.log("Sever connected to port 3000")
})