import EmployeeData from "../models/EmployeeDataModel.js";
import argon2 from "argon2";
import path from "path";

// display semua data Employee
export const getEmployeeData = async (req, res) => {
    try {
        const response = await EmployeeData.findAll({
            attributes: [
                'id', 'national_id', 'employee_name',
                'gender', 'position', 'join_date',
                'status', 'photo', 'access_role'
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// method for find data Employee based on ID
export const getEmployeeDataByID = async (req, res) => {
    try {
        const response = await EmployeeData.findOne({
            attributes: [
                'id', 'national_id', 'employee_name',
                'gender', 'position', 'username', 'join_date',
                'status', 'photo', 'access_role'
            ],
            where: {
                id: req.params.id
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Data employee with ID that not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// method for find data employee based on NATIONAL_ID
export const getEmployeeDataByNik = async (req, res) => {
    try {
        const response = await EmployeeData.findOne({
            attributes: [
                'id', 'national_id', 'employee_name',
                'gender', 'position', 'join_date',
                'status', 'photo', 'access_role'
            ],
            where: {
                national_id: req.params.national_id
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Data employee with NATIONAL_ID that not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


// method for find data employee based on Name
export const getEmployeeDataByName = async (req, res) => {
    try {
        const response = await EmployeeData.findOne({
            attributes: [
                'id', 'national_id', 'employee_name',
                'gender', 'position', 'join_date',
                'status', 'photo', 'access_role'
            ],
            where: {
                employee_name: req.params.name
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Data employee with Name that not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

//  method for tambah data Employee
export const createEmployeeData = async (req, res) => {
    const {
        national_id, employee_name,
        username, password, confPassword, gender,
        position, join_date,
        status, access_role
    } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password and confirmation password do not match" });
    }

    if (!req.files || !req.files.photo) {
        return res.status(400).json({ msg: "Photo upload failed. Please upload again." });
    }

    const file = req.files.photo;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Photo file format is invalid" });
    }

    if (fileSize > 2000000) {
        return res.status(422).json({ msg: "Image size must be less than 2 MB" });
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }

        const hashPassword = await argon2.hash(password);

        try {
            await EmployeeData.create({
                national_id: national_id,
                employee_name: employee_name,
                username: username,
                password: hashPassword,
                gender: gender,
                position: position,
                join_date: join_date,
                status: status,
                photo: fileName,
                url: url,
                access_role: access_role
            });

            res.status(201).json({ success: true, message: "Registration successful" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    });
};


// method for update data Employee
export const updateEmployeeData = async (req, res) => {
    const employee = await EmployeeData.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!employee) return res.staus(404).json({ msg: "Data employee not found" });
    const {
        national_id, employee_name,
        username, gender,
        position, join_date,
        status, access_role
    } = req.body;

    try {
        await EmployeeData.update({
            national_id: national_id,
            employee_name: employee_name,
            username: username,
            gender: gender,
            position: position,
            join_date: join_date,
            status: status,
            access_role: access_role
        }, {
            where: {
                id: employee.id
            }
        });
        res.status(200).json({ msg: "Data Employee Berhasil di Perbarui" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

// Method for update password Employee
export const changePasswordAdmin = async (req, res) => {
    const employee = await EmployeeData.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!employee) return res.status(404).json({ msg: "Data employee not found" });


    const { password, confPassword } = req.body;

    if (password !== confPassword) return res.status(400).json({ msg: "Password and confirmation password do not match" });

    try {
        if (employee.access_role === "employee") {
            const hashPassword = await argon2.hash(password);

            await EmployeeData.update(
                {
                    password: hashPassword
                },
                {
                    where: {
                        id: employee.id
                    }
                }
            );

            res.status(200).json({ msg: "Password Employee Berhasil di Perbarui" });
        } else {
            res.status(403).json({ msg: "Forbidden" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


// method for delete data Employee
export const deleteEmployeeData = async (req, res) => {
    const employee = await EmployeeData.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!employee) return res.status(404).json({ msg: "Data Employee not found" });
    try {
        await EmployeeData.destroy({
            where: {
                id: employee.id
            }
        });
        res.status(200).json({ msg: "Data Employee Berhasil di Hapus" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}