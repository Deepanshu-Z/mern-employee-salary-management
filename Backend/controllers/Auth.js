import EmployeeData from "../models/EmployeeDataModel.js";
import argon2 from "argon2";
import { verifyUser } from "../middleware/AuthUser.js";

export const Login = async (req, res) => {
  let user = {};
  const employee = await EmployeeData.findOne({
    where: {
      username: req.body.username
    }
  });

  if (!employee) {
    return res.status(404).json({ msg: "Employee data not found" });
  }

  const match = await argon2.verify(employee.password, req.body.password);

  if (!match) {
    return res.status(400).json({ msg: "Wrong password" });
  }

  req.session.userId = employee.employee_id;

  user = {
    employee_id: employee.id,
    employee_name: employee.employee_name,
    username: employee.username,
    access_role: employee.access_role
  }

  res.status(200).json({
    employee_id: user.employee_id,
    employee_name: user.employee_name,
    username: user.username,
    access_role: user.access_role,
    msg: "Login successful"
  });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please log in to your account!" });
  }
  const employee = await EmployeeData.findOne({
    attributes: ['id', 'national_id', 'employee_name', 'username', 'access_role'],
    where: {
      employee_id: req.session.userId
    }
  });
  if (!employee) return res.status(404).json({ msg: "User not found" });
  res.status(200).json(employee);
}

export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Cannot log out" });
    res.status(200).json({ msg: "You have logged out" });
  });
}

export const changePassword = async (req, res) => {
  await verifyUser(req, res, () => { });

  const userId = req.userId;

  const user = await EmployeeData.findOne({
    where: {
      id: userId
    }
  });

  const { password, confPassword } = req.body;

  if (password !== confPassword) return res.status(400).json({ msg: "Password and confirmation password do not match" });

  try {
    const hashPassword = await argon2.hash(password);

    await EmployeeData.update(
      {
        password: hashPassword
      },
      {
        where: {
          id: user.id
        }
      }
    )
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};