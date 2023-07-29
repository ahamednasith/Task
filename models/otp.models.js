module.exports = (sequelize,DataTypes) => {
    const Otp = sequelize.define('otp',{
        userId:{
            type: DataTypes.INTEGER
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
    return Otp;
}