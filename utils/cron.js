const cron = require('node-cron');
const {Op} = require('sequelize');
const db = require('../models/index');
const Otp = db.otp;

const removeOtp = async (req,res,next) => {
    const currentTime = new Date();
    await Otp.destroy({
        where:{
            expiredAt:{
                [Op.lte]:currentTime
            }
        }
    });
    next();
}

cron.schedule("*/5 * * * *",removeOtp);


module.exports ={removeOtp};