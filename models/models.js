const { sequelize } = require(".");

module.exports = (sequelize,DataTypes) => {
    const Otp = sequelize.define('otp',{
        userId:{
            type:DataTypes.INTEGER
        },
        phoneNumber:{
            type:DataTypes.STRING
        },
        autoOtp:{
            type:DataTypes.INTEGER
        },
        createdAt:{
            type:DataTypes.DATE
        },
        expiredAt:{
            type:DataTypes.DATE
        }
    },{
        timestamps:false
    });
   const User = sequelize.define('user',{
        userId:{
            type:DataTypes.INTEGER
        },
        name:{
            type:DataTypes.STRING
        },
        age:{
            type:DataTypes.INTEGER
        },
        profie:{
            type:DataTypes.STRING
        },
        signUpDate:{
            type:DataTypes.DATE
        },
        loginDate:{
            type:DataTypes.DATE
        }
    },{
        timestamps:false
    });
    return {
        Otp,User
    };
}