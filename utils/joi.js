const Joi = require('joi');


const otpSchema =Joi.object({
    userId: Joi.number().min(10000000).max(99999999),
    phoneNumber: Joi.number().min(1000000000).max(9999999999),
    autoOtp:Joi.number().min(100000).max(999999),
    signUpDate:Joi.date().iso(),
    loginDate:Joi.date().iso()
});
const otpValidate = (req,res,next) =>{
    const phoneNumber = req.body.phoneNumber;
    const autoOtp = Math.floor(100000 + Math.random() * 900000)
    const signUpDate = new Date();
    const loginDate  = new Date();
    const {error} = otpSchema.validate({phoneNumber,autoOtp,signUpDate,loginDate});
    if(error){
        return res.status(402).json({error:error.message});
    }
    next();
}
const userSchema = Joi.object({
    phoneNumber:Joi.number().min(1000000000).max(9999999999),
    userId:Joi.number().min(10000000).max(99999999),
    name:Joi.string().min(3).max(30),
    age:Joi.number().min(3).max(60),
    signUpDate:Joi.date().iso(),
    loginDate:Joi.date().iso()
});

const userValidate = (req,res,next) => {
    const phoneNumber = req.body.phoneNumber;
    const userId =Math.floor(10000000 + Math.random() * 90000000);
    const name =req.body.name;
    const age = req.body.age;
    const signUpDate = new Date();
    const loginDate = new Date();
    const { error } = userSchema.validate(phoneNumber,userId,name,age,signUpDate,loginDate);
    if(error){
        return res.status(404).json({error:error.message});
    }
    next();
}

module.exports ={ otpValidate,userValidate };