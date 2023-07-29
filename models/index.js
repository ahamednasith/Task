const dbConfig = require('../dbConfig');
const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host:dbConfig.HOST,
    dialect:dbConfig.dialect,
    port:8889,
    timezone:'+05:30'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize,DataTypes);
db.otp = require('./otp.models')(sequelize,DataTypes);

db.sequelize.sync();

module.exports = db;