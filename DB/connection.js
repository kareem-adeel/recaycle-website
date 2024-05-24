import mongoose from "mongoose";

export const connection=async (req,res,next)=>{
    return await mongoose.connect("mongodb+srv://kareemm:kareem123@cluster0.stsykaw.mongodb.net/gradproject").then(()=>{
        console.log("DB Connected");
    }).catch(error=>{
        console.log("Fail To connect");
    })
}

