import AttendanceData from "../models/AttendanceDataModel.js";
import EmployeeData from "../models/EmployeeDataModel.js";
import PositionData from "../models/PositionDataModel.js";
import SalaryDeduction from "../models/SalaryDeductionModel.js";
import moment from "moment";
import "moment/locale/id.js";

const parsePositiveNumber = (value, label) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return { error: `${label} must be a positive number.` };
  }

  return { value: parsedValue };
};

// method for display semua Data Attendance
export const viewAttendanceData = async (req, res) => {
  let resultAttendanceData = [];
  try {
    // Get data attendance
    const data_Attendance = await AttendanceData.findAll({
      attributes: [
        "id",
        "month",
        "national_id",
        "employee_name",
        "gender",
        "position_name",
        "present",
        "sick",
        "absent",
        "createdAt",
      ],
      distinct: true,
    });

    resultAttendanceData = data_Attendance.map((attendance) => {
      const id = attendance.id;
      const createdAt = new Date(attendance.createdAt);
      const year = createdAt.getFullYear();
      const month = attendance.month;
      const national_id = attendance.national_id;
      const employee_name = attendance.employee_name;
      const position_employee = attendance.position_name;
      const gender = attendance.gender;
      const present = attendance.present;
      const sick = attendance.sick;
      const absent = attendance.absent;

      return {
        id,
        month,
        year,
        national_id,
        employee_name,
        position_employee,
        gender,
        present,
        sick,
        absent,
      };
    });
    res.json(resultAttendanceData);
  } catch (error) {
    console.log(error);
  }
};

// method for display Data Attendance by ID
export const viewAttendanceDataByID = async (req, res) => {
  try {
    const dataAttendance = await AttendanceData.findOne({
      attributes: [
        "id",
        "month",
        "national_id",
        "employee_name",
        "gender",
        "position_name",
        "present",
        "sick",
        "absent",
        "createdAt",
      ],
      where: {
        id: req.params.id,
      }
    });
    res.json(dataAttendance);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// method for menambah data attendance
export const createAttendanceData = async (req, res) => {
  const {
    national_id,
    employee_name,
    position_name,
    gender,
    present,
    sick,
    absent,
  } = req.body;

  try {
    const data_employee_name = await EmployeeData.findOne({
      where: {
        employee_name: employee_name,
      },
    });

    const data_position_name = await PositionData.findOne({
      where: {
        position_name: position_name,
      },
    });

    const data_national_id_employee = await EmployeeData.findOne({
      where: {
        national_id: national_id,
      },
    });

    const name_sudah_ada = await AttendanceData.findOne({
      where: {
        employee_name: employee_name,
      },
    });

    if (!data_employee_name) {
      return res.status(404).json({ msg: "Data name employee not found" });
    }

    if (!data_position_name) {
      return res.status(404).json({ msg: "Data name position not found" });
    }

    if (!data_national_id_employee) {
      return res.status(404).json({ msg: "Data national_id not found" });
    }

    if (!name_sudah_ada) {
      const month = moment().locale("id").format("MMMM");
      await AttendanceData.create({
        month: month.toLowerCase(),
        national_id: national_id,
        employee_name: data_employee_name.employee_name,
        gender: gender,
        position_name: data_position_name.position_name,
        present: present,
        sick: sick,
        absent: absent,
      });
      res.json({ msg: "Tambah Data Attendance Berhasil" });
    } else {
      res.status(400).json({ msg: "Data name sudah ada" });
    }
  } catch (error) {
    console.log(error);
  }
};

// method for update data attendance
export const updateAttendanceData = async (req, res) => {
  try {
    await AttendanceData.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data attendance berhasil diupdate" });
  } catch (error) {
    console.log(error.msg);
  }
};

// method for delete data attendance
export const deleteAttendanceData = async (req, res) => {
  try {
    await AttendanceData.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Delete data berhasil" });
  } catch (error) {
    console.log(error.msg);
  }
};

// method for create data deduction salary
export const createDeductionSalaryData = async (req, res) => {
  const { id, deduction, deduction_amount } = req.body;
  const deductionAmountValidation = parsePositiveNumber(deduction_amount, "Deduction amount");

  if (deductionAmountValidation.error) {
    return res.status(422).json({ msg: deductionAmountValidation.error });
  }

  try {
    const name_deduction = await SalaryDeduction.findOne({
      where: {
        deduction: deduction,
      },
    });
    if (name_deduction) {
      res.status(400).json({ msg: "Data deduction sudah ada !" });
    } else {
      await SalaryDeduction.create({
        id: id,
        deduction: deduction,
        deduction_amount: deductionAmountValidation.value,
      });
      res.json({ msg: "Tambah Data Deduction Salary Berhasil" });
    }
  } catch (error) {
    console.log(error);
  }
};

// method for display semua Data Deduction
export const viewDeductionData = async (req, res) => {
  try {
    const dataDeduction = await SalaryDeduction.findAll({
      attributes: ["id", "deduction", "deduction_amount"],
    });
    res.json(dataDeduction);
  } catch (error) {
    console.log(error);
  }
};

// method for display Data Deduction By ID
export const viewDeductionDataByID = async (req, res) => {
  try {
    const dataDeduction = await SalaryDeduction.findOne({
      attributes: ["id", "deduction", "deduction_amount"],
      where: {
        id: req.params.id,
      },
    });
    res.json(dataDeduction);
  } catch (error) {
    console.log(error);
  }
};

// method for update Data Deduction
export const updateDeductionData = async (req, res) => {
  const deductionAmountValidation = parsePositiveNumber(req.body.deduction_amount, "Deduction amount");

  if (deductionAmountValidation.error) {
    return res.status(422).json({ msg: deductionAmountValidation.error });
  }

  try {
    await SalaryDeduction.update(
      {
        ...req.body,
        deduction_amount: deductionAmountValidation.value,
      },
      {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Data Deduction berhasil diupdate" });
  } catch (error) {
    console.log(error.message);
  }
};

// method for delete data deduction
export const deleteDeductionData = async (req, res) => {
  try {
    await SalaryDeduction.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Delete data berhasil" });
  } catch (error) {
    console.log(error.message);
  }
};

// method for mengambil data salary employee (data employee + data position + data attendance + data deduction)

// method for mengambil data employee :
export const getEmployeeData = async () => {
  let resultEmployeeData = [];

  try {
    // Get data employee:
    const employee_data = await EmployeeData.findAll({
      attributes: ["id", "national_id", "employee_name", "gender", "position"],
      distinct: true,
    });

    resultEmployeeData = employee_data.map((employee) => {
      const id = employee.id;
      const national_id = employee.national_id;
      const employee_name = employee.employee_name;
      const gender = employee.gender;
      const position_employee = employee.position;

      return { id, national_id, employee_name, gender, position_employee };
    });
  } catch (error) {
    console.error(error);
  }

  return resultEmployeeData;
};

// method for mengambil data position :
export const getPositionData = async () => {
  let resultPositionData = [];
  try {
    // get data position :
    const position_data = await PositionData.findAll({
      attributes: ["position_name", "base_salary", "transport_allowance", "meal_allowance"],
      distinct: true,
    });

    resultPositionData = position_data.map((position) => {
      const position_name = position.position_name;
      const base_salary = position.base_salary;
      const transport_allowance = position.transport_allowance;
      const meal_allowance = position.meal_allowance;

      return { position_name, base_salary, transport_allowance, meal_allowance };
    });
  } catch (error) {
    console.error(error);
  }
  return resultPositionData;
};

// method for mengambil data attendance :
export const getAttendanceData = async () => {
  try {
    // Get data attendance
    const data_Attendance = await AttendanceData.findAll({
      attributes: [
        "month",
        "national_id",
        "employee_name",
        "gender",
        "position_name",
        "present",
        "sick",
        "absent",
        "createdAt",
      ],
      distinct: true,
    });

    const resultAttendanceData = data_Attendance.map((attendance) => {
      const createdAt = new Date(attendance.createdAt);
      const year = createdAt.getFullYear();
      const month = attendance.month;
      const national_id = attendance.national_id;
      const employee_name = attendance.employee_name;
      const position_employee = attendance.position_name;
      const present = attendance.present;
      const sick = attendance.sick;
      const absent = attendance.absent;

      return {
        month,
        year,
        national_id,
        employee_name,
        position_employee,
        present,
        sick,
        absent,
      };
    });
    return resultAttendanceData;
  } catch (error) {
    console.error(error);
  }
};

export const getDeductionData = async () => {
  let resultDeductionData = [];
  try {
    // get data deduction :
    const deduction_data = await SalaryDeduction.findAll({
      attributes: ["id", "deduction", "deduction_amount"],
      distinct: true,
    });
    resultDeductionData = deduction_data.map((deduction) => {
      const id = deduction.id;
      const name_deduction = deduction.deduction;
      const deduction_amount = deduction.deduction_amount;

      return { id, name_deduction, deduction_amount };
    });
  } catch (error) {
    console.error(error);
  }
  return resultDeductionData;
};

// Logika matematika
export const getSalaryDataEmployee = async () => {
  try {
    // Salary Employee :
    const resultEmployeeData = await getEmployeeData();
    const resultPositionData = await getPositionData();

    const employee_salary = resultEmployeeData
      .filter((employee) =>
        resultPositionData.some(
          (position) => position.position_name === employee.position_employee
        )
      )
      .map((employee) => {
        const position = resultPositionData.find(
          (position) => position.position_name === employee.position_employee
        );
        return {
          id: employee.id,
          national_id: employee.national_id,
          employee_name: employee.employee_name,
          position: employee.position_employee,
          base_salary: position.base_salary,
          transport_allowance: position.transport_allowance,
          meal_allowance: position.meal_allowance,
        };
      });

    // Deduction Employee :
    const resultAttendanceData = await getAttendanceData();
    const resultDeductionData = await getDeductionData();

    const deduction_employee = resultAttendanceData.map((attendance) => {
      const deductionAlpha = attendance.absent > 0 ?
        resultDeductionData
          .filter((deduction) => deduction.name_deduction.toLowerCase() === "absent")
          .reduce((total, deduction) => total + deduction.deduction_amount * attendance.absent, 0) : 0;

      const deductionSakit = attendance.sick > 0 ?
        resultDeductionData
          .filter((deduction) => deduction.name_deduction.toLowerCase() === "sick")
          .reduce((total, deduction) => total + deduction.deduction_amount * attendance.sick, 0) : 0;

      return {
        year: attendance.year,
        month: attendance.month,
        employee_name: attendance.employee_name,
        present: attendance.present,
        sick: attendance.sick,
        absent: attendance.absent,
        deductionSakit: deductionSakit,
        deductionAlpha: deductionAlpha,
        total_deduction: deductionSakit + deductionAlpha
      };
    });

    // Total Salary Employee :
    const total_employee_salary = employee_salary.map((employee) => {
      const id = employee.id;
      const attendance = resultAttendanceData.find(
        (attendance) => attendance.employee_name === employee.employee_name
      );
      const deduction = deduction_employee.find(
        (deduction) => deduction.employee_name === employee.employee_name
      );
      const total_salary =
      (employee.base_salary +
      employee.transport_allowance +
      employee.meal_allowance -
      (deduction ? deduction.total_deduction : 0)).toLocaleString();

      return {
        year: deduction ? deduction.year : attendance ? attendance.year : 0,
        month: deduction ? deduction.month : attendance ? attendance.month : 0,
        id: id,
        national_id: employee.national_id,
        employee_name: employee.employee_name,
        position: employee.position,
        base_salary: employee.base_salary.toLocaleString(),
        transport_allowance: employee.transport_allowance.toLocaleString(),
        meal_allowance: employee.meal_allowance.toLocaleString(),
        present: attendance.present,
        sick: attendance.sick,
        absent: attendance.absent,
        deduction: deduction ? deduction.total_deduction.toLocaleString() : 0,
        total: total_salary,
      };
    });
    return total_employee_salary;
  } catch (error) {
    console.error(error);
  }
};

// method for melihat data salary employee
export const viewSalaryDataEmployee = async (req, res) => {
  try {
    const dataSalaryEmployee = await getSalaryDataEmployee();
    res.status(200).json(dataSalaryEmployee);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const viewSalaryDataEmployeeByName = async (req, res) => {
  try {
    const dataSalaryEmployee = await getSalaryDataEmployee();
    const { name } = req.params;

    const dataSalaryByName = dataSalaryEmployee
      .filter((salary_data) => {
        return salary_data.employee_name
          .toLowerCase()
          .includes(name.toLowerCase().replace(/ /g, ""));
      })
      .map((salary_data) => {
        return {
          year: salary_data.year,
          month: salary_data.month,
          id: salary_data.id,
          national_id: salary_data.national_id,
          employee_name: salary_data.employee_name,
          position: salary_data.position,
          gender: salary_data.gender,
          position_employee: salary_data.position_employee,
          base_salary: salary_data.base_salary,
          transport_allowance: salary_data.transport_allowance,
          meal_allowance: salary_data.meal_allowance,
          deduction: salary_data.deduction,
          total_salary: salary_data.total,
        };
      });

    if (dataSalaryByName.length === 0) {
      return res.status(404).json({ msg: 'Data not found' });
    }
    return res.json(dataSalaryByName);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// method for melihat data salary employee based on ID
export const viewSalaryDataById = async (req, res) => {
  try {
    const dataSalaryEmployee = await getSalaryDataEmployee(req, res);
    const id = parseInt(req.params.id);

    const foundData = dataSalaryEmployee.find((data) => data.id === id);

    if (!foundData) {
      res.status(404).json({ msg: "Data not found" });
    } else {
      res.json(foundData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// method for melihat data salary employee based on Name
export const viewSalaryDataByName = async (req, res) => {
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



// method for find data salary employee based on month
export const viewSalaryDataEmployeeByMonth = async (req, res) => {
  try {
    const dataSalaryEmployee = await getSalaryDataEmployee();
    const response = await AttendanceData.findOne({
      attributes: ["month"],
      where: {
        month: req.params.month,
      },
    });

    if (response) {
      const dataSalaryByMonth = dataSalaryEmployee
        .filter((salary_data) => {
          return salary_data.month === response.month;
        })
        .map((salary_data) => {
          return {
            month: response.month,
            id: salary_data.id,
            national_id: salary_data.national_id,
            employee_name: salary_data.employee_name,
            gender: salary_data.gender,
            position_employee: salary_data.position_employee,
            base_salary: salary_data.base_salary,
            transport_allowance: salary_data.transport_allowance,
            meal_allowance: salary_data.meal_allowance,
            deduction: salary_data.deduction,
            total_salary: salary_data.total,
          };
        });
      return res.json(dataSalaryByMonth);
    }

    res
      .status(404)
      .json({ msg: `Data for month ${req.params.month} not found` });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// method for find data salary employee based on year
export const viewSalaryDataEmployeeByYear = async (req, res) => {
  try {
    const dataSalaryEmployee = await getSalaryDataEmployee();
    const { year } = req.params;

    const dataSalaryByYear = dataSalaryEmployee
      .filter((salary_data) => {
        const salaryYear = salary_data.year;
        return salaryYear === parseInt(year);
      })
      .map((salary_data) => {
        return {
          year: salary_data.year,
          id: salary_data.id,
          national_id: salary_data.national_id,
          employee_name: salary_data.employee_name,
          gender: salary_data.gender,
          position_employee: salary_data.position,
          present: salary_data.present,
          sick: salary_data.sick,
          absent: salary_data.absent,
          base_salary: salary_data.base_salary,
          transport_allowance: salary_data.transport_allowance,
          meal_allowance: salary_data.meal_allowance,
          deduction: salary_data.deduction,
          total_salary: salary_data.total,
        };
      });

    if (dataSalaryByYear.length === 0) {
      return res
        .status(404)
        .json({ msg: `Data year ${year} not found` });
    }
    res.json(dataSalaryByYear);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// method for find data salary employee based on year
export const dataReportSalaryByYear = async (req, res) => {
  try {
    const dataSalaryEmployee = await getSalaryDataEmployee();
    const { year } = req.params;

    const dataSalaryByYear = dataSalaryEmployee
      .filter((salary_data) => {
        const salaryYear = salary_data.year;
        return salaryYear === parseInt(year);
      })
      .map((salary_data) => {
        return {
          year: salary_data.year,
          id: salary_data.id,
          national_id: salary_data.national_id,
          employee_name: salary_data.employee_name,
          gender: salary_data.gender,
          position_employee: salary_data.position_employee,
          base_salary: salary_data.base_salary,
          transport_allowance: salary_data.transport_allowance,
          meal_allowance: salary_data.meal_allowance,
          deduction: salary_data.deduction,
          total_salary: salary_data.total,
        };
      });

    if (dataSalaryByYear.length === 0) {
      return res
        .status(404)
        .json({ msg: `Data year ${year} not found` });
    } else {
      const reportByYear = dataSalaryByYear.map((data) => data.year)
      console.log(reportByYear)
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};