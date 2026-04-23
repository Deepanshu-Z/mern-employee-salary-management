import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import EmployeeData from './EmployeeDataModel.js';

const {DataTypes} = Sequelize;

const PositionData = db.define('position_data',{
        position_id: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        position_name: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        base_salary: {
            type: DataTypes.INTEGER(50),
            allowNull: false
        },
        transport_allowance: {
            type: DataTypes.INTEGER(50),
            allowNull: false
        },
        meal_allowance: {
            type: DataTypes.INTEGER(50)
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },{
        freezeTableName: true
});

EmployeeData.hasMany(PositionData);
PositionData.belongsTo(EmployeeData, {foreignKey: 'userId'});

export default PositionData;