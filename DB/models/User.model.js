import mongoose, { Schema,Types,model } from "mongoose";



const userSchema=new Schema({
Name:{
    type:String,
    required:[true,'Name is Required'],
    min:[2,'Minimum length'],
    max:[20,'Maximum length'],
    lowerCase:true
},
password:{
    type:String,
    required:[true,'Password Required']
},
email:{
    type:String,
    unique:true,
    required:[true,'Password Required'],
    lowerCase:true
},
role:{
    type:String,
    enum:['Admin','User'],
    default:'User'
},
gender:{
    type:String,
    enum:['Male','Female'],
    default:'Male'
},
status:{
    type:String,
    enum:['Offline','Online'],
    default:'Offline'
},
confirmEmail:{
    type:Boolean,
    default:false
},
points:{
    type:Number,
    min:1
},
code:String,
age:Number,
address:String,
DOB:String,
stripeAccountId: {
    type: String, // معرف حساب Stripe
    required: false,
  },



},
{
    timestamps:true
})

// mongoose.model.userModel||
const userModel=model("User",userSchema)

export default userModel