import {
    getSalaryDataEmployee,
    getAttendanceData,
    viewSalaryDataEmployeeByYear
} from "./TransactionController.js"

// method for melihat report salary employee
export const viewReportSalaryEmployee = async(req, res) => {
    try {
        const reportSalaryEmployee = await getSalaryDataEmployee(req, res);
        res.status(200).json(reportSalaryEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// method for melihat report salary employee based on month
export const viewReportSalaryEmployeeByMonth = async (req, res) => {
    try {
        const { month } = req.params;
        const dataReportSalaryByMonth = await getSalaryDataEmployee(req, res);

        const filteredData = dataReportSalaryByMonth.filter((data) => {
            return data.month.toLowerCase() === month.toLowerCase();
        });

        if (filteredData.length === 0) {
            res.status(404).json({ msg: 'Data not found' });
        } else {
            const formattedData = filteredData.map((data) => {
                return {
                    month: data.month,
                    employee_name: data.employee_name,
                    position: data.position_employee,
                    base_salary: data.base_salary,
                    transport_allowance: data.transport_allowance,
                    meal_allowance: data.meal_allowance,
                    deduction: data.deduction,
                    total_salary: data.total
                };
            });
            res.json(formattedData);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





// method for melihat report salary employee based on year
export const viewReportSalaryEmployeeByYear = async (req, res) => {
    try {
         await viewSalaryDataEmployeeByYear(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// method for melihat report salary employee based on name
export const viewReportSalaryEmployeeByName = async (req, res) => {
    try {
        const dataSalaryEmployee = await getSalaryDataEmployee(req, res);
        const name = req.params.name.toLowerCase();

        const foundData = dataSalaryEmployee.filter((data) => {
          const formattedName = data.employee_name.toLowerCase();
          const searchKeywords = name.split(" ");

          return searchKeywords.every((keyword) => formattedName.includes(keyword));
        });

        if (foundData.length === 0) {
          res.status(404).json({ msg: "Data not found" });
        } else {
          res.json(foundData);
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
      }
  };

// method for melihat report attendance employee based on month (menggunakan DROP DOWN)
export const viewReportAttendanceEmployeeByMonth = async (req, res) => {
    try {
        const dataAttendanceByMonth = await getAttendanceData();
        const { month } = req.params;

        const dataAttendance = dataAttendanceByMonth.filter((attendance) => attendance.month.toLowerCase() === month.toLowerCase()).map((attendance) => {
            return {
                year: attendance.year,
                month: attendance.month,
                national_id: attendance.national_id,
                employee_name: attendance.employee_name,
                position_employee: attendance.position_employee,
                present: attendance.present,
                sick: attendance.sick,
                absent: attendance.absent
            };
        });

        if (dataAttendance.length === 0) {
            res.status(404).json({ msg: 'Data not found' });
        } else {
            res.json(dataAttendance);
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


// method for melihat report attendance employee based on year
export const viewReportAttendanceEmployeeByYear = async (req, res) => {
    try {
        const dataAttendanceByYear = await getAttendanceData();
        const { year } = req.params;

        const dataAttendance = dataAttendanceByYear.filter((attendance) => attendance.year.toString() === year.toString()).map((attendance) => {
            return {
                year: attendance.year,
                month: attendance.month,
                national_id: attendance.national_id,
                employee_name: attendance.employee_name,
                position_employee: attendance.position_employee,
                present: attendance.present,
                sick: attendance.sick,
                absent: attendance.absent
            };
        });

        if (dataAttendance.length === 0) {
            res.status(404).json({ msg: 'Data not found' });
        } else {
            res.json(dataAttendance);
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};



// method for melihat Slip Salary Employee By Name
export const viewSlipSalaryByName = async (req, res) => {
    try {
        const dataSalaryEmployee = await getSalaryDataEmployee(req, res);
        const name = req.params.name.toLowerCase();

        const foundData = dataSalaryEmployee.filter((data) => {
          const formattedName = data.employee_name.toLowerCase();
          const searchKeywords = name.split(" ");

          return searchKeywords.every((keyword) => formattedName.includes(keyword));
        });

        if (foundData.length === 0) {
          res.status(404).json({ msg: "Data not found" });
        } else {
          res.json(foundData);
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
      }
}

// method for melihat Slip Salary Employee By Month
export const viewSlipSalaryByMonth = async (req, res) => {
    try {
        const { month } = req.params;
        const dataReportSalaryByMonth = await getSalaryDataEmployee(req, res);

        const filteredData = dataReportSalaryByMonth.filter((data) => {
            return data.month.toLowerCase() === month.toLowerCase();
        });

        if (filteredData.length === 0) {
            res.status(404).json({ msg: `Data with month ${month} not found ` });
        } else {
            const formattedData = filteredData.map((data) => {
                return {
                    month: data.month,
                    year: data.year,
                    employee_name: data.employee_name,
                    position: data.position,
                    base_salary: data.base_salary,
                    transport_allowance: data.transport_allowance,
                    meal_allowance: data.meal_allowance,
                    deduction: data.deduction,
                    total_salary: data.total
                };
            });
            res.json(formattedData);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// method for melihat Slip Salary Employee By Year
export const viewSlipSalaryByYear = async (req, res) => {
    try {
        await viewSalaryDataEmployeeByYear(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}