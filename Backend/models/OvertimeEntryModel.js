import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import EmployeeData from "./EmployeeDataModel.js";

const { DataTypes } = Sequelize;

const OvertimeEntry = db.define(
  "overtime_entries",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    overtime_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    overtime_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payroll_status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "submitted",
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["employeeId", "overtime_date"],
      },
    ],
  },
);

EmployeeData.hasMany(OvertimeEntry, { foreignKey: "employeeId" });
OvertimeEntry.belongsTo(EmployeeData, { foreignKey: "employeeId" });

export default OvertimeEntry;
