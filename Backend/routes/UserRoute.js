import express from 'express';

/* === import Middleware === */
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';

/* === import Controllers === */
import {
    getEmployeeData,
    getEmployeeDataByID,
    createEmployeeData,
    updateEmployeeData,
    deleteEmployeeData,
    getEmployeeDataByNik,
    getEmployeeDataByName,
} from '../controllers/EmployeeData.js';

import {
    getPositionData,
    createPositionData,
    updatePositionData,
    deletePositionData,
    getPositionDataByID
} from "../controllers/PositionData.js";

import {
    viewAttendanceData,
    createAttendanceData,
    updateAttendanceData,
    deleteAttendanceData,
    viewAttendanceDataByID,
    viewSalaryDataByName,
} from "../controllers/TransactionController.js";

import {
    createDeductionSalaryData,
    deleteDeductionData,
    viewDeductionDataByID,
    updateDeductionData,
    viewDeductionData
} from "../controllers/TransactionController.js";

import {
    viewSalaryDataEmployee,
    viewSalaryDataEmployeeByMonth,
    viewSalaryDataEmployeeByYear
} from "../controllers/TransactionController.js";

import {
    viewReportAttendanceEmployeeByMonth,
    viewReportAttendanceEmployeeByYear,
    viewReportSalaryEmployee,
    viewReportSalaryEmployeeByMonth,
    viewReportSalaryEmployeeByName,
    viewReportSalaryEmployeeByYear,
    viewSlipSalaryByMonth,
    viewSlipSalaryByName,
    viewSlipSalaryByYear,
} from "../controllers/ReportController.js";

import { LogOut, changePassword } from '../controllers/Auth.js';
import {
    dashboardEmployee,
    viewSalaryDataSingleEmployeeByMonth,
    viewSalaryDataSingleEmployeeByYear
} from '../controllers/Employee.js';

const router = express.Router();

// Admin Route :

/* ==== Master Data ==== */
// Data Employee
router.get('/employee_data', verifyUser, adminOnly, getEmployeeData);
router.get('/employee_data/id/:id', verifyUser, adminOnly, getEmployeeDataByID);
router.get('/employee_data/national_id/:national_id', verifyUser, adminOnly, getEmployeeDataByNik);
router.get('/employee_data/name/:name', verifyUser, getEmployeeDataByName);
router.post('/employee_data',verifyUser, adminOnly, createEmployeeData);
router.patch('/employee_data/:id', verifyUser, adminOnly, updateEmployeeData);
router.delete('/employee_data/:id', verifyUser, adminOnly, deleteEmployeeData);
router.patch('/employee_data/:id/change_password', verifyUser, adminOnly, changePassword);
// Data Position
router.get('/position_data', verifyUser, adminOnly, getPositionData);
router.get('/position_data/:id', verifyUser, adminOnly, getPositionDataByID);
router.post('/position_data', verifyUser, adminOnly, createPositionData);
router.patch('/position_data/:id', verifyUser, adminOnly, updatePositionData);
router.delete('/position_data/:id', verifyUser, adminOnly, deletePositionData);

/* ==== Transaction  ==== */
// Data Attendance
router.get('/attendance_data', verifyUser, adminOnly, viewAttendanceData);
router.get('/attendance_data/:id', verifyUser, adminOnly, viewAttendanceDataByID);
router.post('/attendance_data',verifyUser, adminOnly, createAttendanceData);
router.patch('/attendance_data/update/:id',verifyUser, adminOnly, updateAttendanceData);
router.delete('/attendance_data/:id', verifyUser, adminOnly, deleteAttendanceData);
// Data Deduction
router.get('/deduction_data', adminOnly, verifyUser, viewDeductionData);
router.get('/deduction_data/:id', adminOnly, verifyUser, viewDeductionDataByID);
router.post('/deduction_data', adminOnly, verifyUser, createDeductionSalaryData);
router.patch('/deduction_data/update/:id', adminOnly, verifyUser, updateDeductionData);
router.delete('/deduction_data/:id', adminOnly, verifyUser, deleteDeductionData);
// Data Salary
router.get('/employee_salary_data', viewSalaryDataEmployee);
router.get('/salary_data/name/:name', verifyUser, viewSalaryDataByName);
router.get('/employee_salary_data/month/:month', viewSalaryDataEmployeeByMonth);
router.get('/employee_salary_data/year/:year', viewSalaryDataEmployeeByYear);

/* ====  Report  ==== */
// report Salary Employee
router.get('/report/salary',verifyUser, adminOnly, viewReportSalaryEmployee);
router.get('/report/salary/name/:name',verifyUser, adminOnly, viewReportSalaryEmployeeByName);
router.get('/report/salary/month/:month', verifyUser, adminOnly,viewReportSalaryEmployeeByMonth);
router.get('/report/salary/year/:year', verifyUser, adminOnly,viewReportSalaryEmployeeByYear);
// Report Attendance Employee
router.get('/report/attendance/month/:month', verifyUser, adminOnly,viewReportAttendanceEmployeeByMonth);
router.get('/report/attendance/year/:year', verifyUser, adminOnly,viewReportAttendanceEmployeeByYear);
// Slip Salary Employee
router.get('/report/salary_slip/name/:name', verifyUser, adminOnly,viewSlipSalaryByName);
router.get('/report/salary_slip/month/:month',verifyUser, adminOnly, viewSlipSalaryByMonth);
router.get('/report/salary_slip/year/:year',verifyUser, adminOnly, viewSlipSalaryByYear);

/* ==== Change Password ==== */
router.patch('/change_password', verifyUser, changePassword);

/* ==== Logout ==== */
router.delete('/logout', LogOut);

// Employee Route :
/* ==== Dashboard ==== */
router.get('/dashboard', verifyUser, dashboardEmployee);
/* ==== Data Salary ==== */
router.get('/salary_data/month/:month', verifyUser, viewSalaryDataSingleEmployeeByMonth);
router.get('/salary_data/year/:year', verifyUser, viewSalaryDataSingleEmployeeByYear);
/* ==== Change Password ==== */
router.patch('/change_password', verifyUser, changePassword);
/* ==== Logout ==== */
router.delete('/logout', LogOut);


export default router;