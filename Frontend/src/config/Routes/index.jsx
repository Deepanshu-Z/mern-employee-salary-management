import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '../../components/molecules/NotFound'
import Home from '../../pages/Home';
import About from '../../pages/About';
import Contact from '../../pages/Contact';
import Login from '../../pages/Login';
import Dashboard from '../../pages/Dashboard';
import {
  FormAddPositionData,
  FormEditPositionData,
  FormAddAttendanceData,
  FormEditAttendanceData,
  FormAddEmployeeData,
  FormEditEmployeeData,
  FormAddDeductionData,
  FormEditDeductionData,
  PrintPdfReportSalary,
  DetailSalaryData,
  PrintPdfSlipSalary,
  PrintPdfReportAttendance,
  PrintPdfSalaryDataEmployee
} from '../../components';
import {
  EmployeeData,
  PositionData,
  AttendanceData,
  SalaryData,
  ReportSalary,
  ReportAttendance,
  SlipSalary,
  ChangePasswordAdmin,
  SalaryDataEmployee,
  ChangePasswordEmployee,
  DeductionData
} from '../../pages'

const AppRoutes = () => {
  return (

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />

      {/* Route Admin */}
      {/* Master Data Admin */}
      <Route
        path='/data-employee'
        element={<EmployeeData />}
      />
      <Route
        path='/data-employee/form-data-employee/add'
        element={<FormAddEmployeeData />}
      />
      <Route
        path='/data-employee/form-data-employee/edit/:id'
        element={<FormEditEmployeeData />}
      />
      <Route
        path='/data-position'
        element={<PositionData />}
      />
      <Route
        path='/data-position/form-data-position/add'
        element={<FormAddPositionData />}
      />
      <Route
        path='/data-position/form-data-position/edit/:id'
        element={<FormEditPositionData />}
      />

      {/* Transaction Admin */}
      <Route
        path='/data-attendance'
        element={<AttendanceData />}
      />
      <Route
        path='/data-attendance/form-data-attendance/add'
        element={<FormAddAttendanceData />}
      />
      <Route
        path='/data-attendance/form-data-attendance/edit/:id'
        element={<FormEditAttendanceData />}
      />
      <Route
        path='/data-deduction'
        element={<DeductionData />}
      />
      <Route
        path='/data-deduction/form-data-deduction/add'
        element={<FormAddDeductionData />} />
      <Route
        path='/data-deduction/form-data-deduction/edit/:id'
        element={<FormEditDeductionData />} />
      <Route
        path='/data-salary'
        element={<SalaryData />}
      />
      <Route
        path='/data-salary/detail-data-salary/name/:name'
        element={<DetailSalaryData />}
      />
      <Route
        path='/data-salary/print-salary/slip-salary/name/:name'
        element={<PrintPdfSlipSalary />}
      />

      {/* Report Admin */}
      <Route
        path='/report/salary'
        element={<ReportSalary />}
      />
      <Route
        path='/report/salary/print-page'
        element={<PrintPdfReportSalary />}
      />
      <Route
        path='/report/attendance'
        element={<ReportAttendance />}
      />
      <Route
        path='/report/attendance/print-page'
        element={<PrintPdfReportAttendance />}
      />
      <Route
        path='/report/slip-salary'
        element={<SlipSalary />}
      />
      <Route
        path='/report/slip-salary/print-page'
        element={<PrintPdfSlipSalary />}
      />

      {/* Settings Admin */}
      <Route
        path='/change-password'
        element={<ChangePasswordAdmin />}
      />

      {/* Route Employee */}
      {/* Dashboard Data Salary Employee */}
      <Route
        path='/data-salary-employee'
        element={<SalaryDataEmployee />}
      />
      <Route
        path='/data-salary-employee/print-page'
        element={<PrintPdfSalaryDataEmployee />}
      />
      <Route
        path='/change-password-employee'
        element={<ChangePasswordEmployee />}
      />

      {/* Route Not Found 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}

export default AppRoutes;
