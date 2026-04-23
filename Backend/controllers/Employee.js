import EmployeeData from "../models/EmployeeDataModel.js";
import AttendanceData from "../models/AttendanceDataModel.js";
import { getSalaryDataEmployee } from "./TransactionController.js";
import { verifyUser } from "../middleware/AuthUser.js";

// method for dashboard employee
export const dashboardEmployee = async (req, res) => {
    await verifyUser(req, res, () => {});

    const userId = req.userId;

    const response = await EmployeeData.findOne({
      where:{
        id: userId
      },
      attributes: [
        'id', 'national_id', 'employee_name',
        'gender', 'position', 'join_date',
        'status', 'photo', 'access_role'
      ]
    });

    res.status(200).json(response);
  };

// method for view salary single employee by month
export const viewSalaryDataSingleEmployeeByMonth = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;
  const user = await EmployeeData.findOne({
    where:{
      id: userId
    }
  });

  try {
      const dataSalaryEmployee = await getSalaryDataEmployee();

      const response = await AttendanceData.findOne({
          attributes: [
              'month'
          ],
          where: {
              month: req.params.month
          }
      });

      if (response) {
        const dataSalaryByMonth = dataSalaryEmployee.filter((salary_data) => {
          return salary_data.id === user.id && salary_data.month === response.month;
        }).map((salary_data) => {
          return {
            month: response.month,
            year: salary_data.year,
            national_id: user.national_id,
            employee_name: user.employee_name,
            gender: user.gender,
            position: user.position,
            base_salary: salary_data.base_salary,
            transport_allowance: salary_data.transport_allowance,
            meal_allowance: salary_data.meal_allowance,
            deduction: salary_data.deduction,
            total_salary: salary_data.total,
          };
        });
          return res.json(dataSalaryByMonth);
      }

      res.status(404).json({ msg: `Salary data for month ${req.params.month} was not found for employee ${user.employee_name}` });
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// method for view salary single employee by year
export const viewSalaryDataSingleEmployeeByYear = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;
  const user = await EmployeeData.findOne({
    where:{
      id: userId
    }
  });

  try {
    const dataSalaryEmployee = await getSalaryDataEmployee();
    const { year } = req.params;

    const dataSalaryByYear = dataSalaryEmployee.filter((salary_data) => {
        return salary_data.id === user.id && salary_data.year === parseInt(year);
    }).map((salary_data) => {
        return {
            year: salary_data.year,
            month: salary_data.month,
            national_id: user.national_id,
            employee_name: user.employee_name,
            gender: user.gender,
            position: user.position,
            base_salary: salary_data.base_salary,
            transport_allowance: salary_data.transport_allowance,
            meal_allowance: salary_data.meal_allowance,
            deduction: salary_data.deduction,
            total_salary: salary_data.total,
        };
    });

    if (dataSalaryByYear.length === 0) {
        return res.status(404).json({ msg: `Year ${year} data was not found` });
    }
    res.json(dataSalaryByYear)
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

// displayed data (Month/Year, Base Salary, transport allowance, meal allowance, deduction, total salary)