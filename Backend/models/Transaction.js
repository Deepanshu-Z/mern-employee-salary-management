import EmployeeData from './EmployeeDataModel.js';
import PositionData from './PositionDataModel.js';
import AttendanceData from './AttendanceDataModel.js';

/* Method for mengambil Data Employee */

async function getEmployeeData() {
    try {
        const dataEmployee = await EmployeeData.findAll();
        const dataEmployeeMap = new Map();
        dataEmployee.forEach(employee => {
            const {national_id, employee_name, position} = employee;
            dataEmployeeMap.set(employee_name, {national_id, position});
        });

        const resultEmployeeData = [];
        dataEmployeeMap.forEach(({national_id, position}, employee_name) => {
            resultEmployeeData.push({national_id, employee_name, position});
        });

        const data_employee_name = resultEmployeeData.map(employee => employee.employee_name);
        const data_national_id = resultEmployeeData.map(employee => employee.national_id);
        const position_data = resultEmployeeData.map(employee => employee.position);

        return { data_employee_name, data_national_id, position_data };
    } catch (error) {
        console.log(error);
    }
}

/* Method for mengambil Data Attendance */

async function getAttendanceData() {
    try {
    const dataAttendance = await AttendanceData.findAll();
    const dataAttendanceMap = new Map();

    const { data_employee_name } = await getEmployeeData();
    const { data_national_id } = await getEmployeeData();

    dataAttendance.forEach(attendance => {
        const { national_id, month, gender, position_name, present, sick, absent } = attendance;
        const employee_name = data_employee_name.find(name => name === attendance.employee_name) || "-";
        const national_id_employee = data_national_id.find(national_id => national_id === attendance.national_id) || "-";
        dataAttendanceMap.set(national_id_employee, { employee_name, month, gender, position_name, present, sick, absent });
    });

    const resultAttendanceData = [];
    dataAttendanceMap.forEach(({ national_id, month, gender, position_name, present, sick, absent }, national_idEmployee) => {
        const employee_name = data_employee_name.find(name => name === dataAttendanceMap.get(national_idEmployee).employee_name) || "-";
        resultAttendanceData.push({ employee_name, national_id, month, gender, position_name, present, sick, absent });
    });

    console.log(resultAttendanceData);

    } catch (error) {
    console.log(error);
    }
}

getAttendanceData();



/* Method for mengambil Data Employee */

async function getPositionData() {
    const dataPosition = await PositionData.findAll();
    const datapositionMap = new Map();
    try {
        dataPosition.forEach(position => {
            const {position_name, base_salary, transport_allowance, meal_allowance} = position;
            datapositionMap.set(position_name, {base_salary, transport_allowance, meal_allowance});
        });

        const resultDataposition = [];
        datapositionMap.forEach(({base_salary, transport_allowance, meal_allowance}, position_name) => {
            resultDataposition.push({position_name, base_salary, transport_allowance, meal_allowance});
        });

        return resultDataposition;
    } catch (error) {
        console.log(error);
    }
}