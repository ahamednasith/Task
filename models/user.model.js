module.exports = (sequelize,DataTypes) => {
    const User = sequelize.define('user',{
        phoneNumber:{
            type:DataTypes.STRING
        },
        userId:{
            type:DataTypes.INTEGER
        },
        name:{
            type:DataTypes.STRING
        },
        age:{
            type:DataTypes.INTEGER
        },
        picture:{
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
    return User;
}