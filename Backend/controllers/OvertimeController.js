import { Op } from "sequelize";
import EmployeeData from "../models/EmployeeDataModel.js";
import OvertimeEntry from "../models/OvertimeEntryModel.js";

const MAX_DAILY_OVERTIME = 6;
const MIN_DAILY_OVERTIME = 1;
const MAX_PAST_DAYS = 7;
const MONTHLY_OVERTIME_LIMIT = 60;

const toIsoDate = (date) => date.toISOString().split("T")[0];

const validateOvertimePayload = ({ employeeId, overtime_date, overtime_hours, reason }) => {
  if (!employeeId || !overtime_date || overtime_hours === undefined || !reason) {
    return "All fields are required.";
  }

  const overtimeHoursNumber = Number(overtime_hours);
  if (!Number.isInteger(overtimeHoursNumber)) {
    return "Overtime hours must be a whole number.";
  }

  if (
    overtimeHoursNumber < MIN_DAILY_OVERTIME ||
    overtimeHoursNumber > MAX_DAILY_OVERTIME
  ) {
    return `Overtime hours must be between ${MIN_DAILY_OVERTIME} and ${MAX_DAILY_OVERTIME}.`;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overtimeDate = new Date(overtime_date);
  if (Number.isNaN(overtimeDate.getTime())) {
    return "Please provide a valid overtime date.";
  }
  overtimeDate.setHours(0, 0, 0, 0);

  if (overtimeDate > today) {
    return "Date cannot be in the future.";
  }

  const oldestAllowedDate = new Date(today);
  oldestAllowedDate.setDate(today.getDate() - MAX_PAST_DAYS);
  if (overtimeDate < oldestAllowedDate) {
    return `Date cannot be more than ${MAX_PAST_DAYS} days in the past.`;
  }

  if (reason.trim().length < 10) {
    return "Reason must be at least 10 characters.";
  }

  return null;
};

export const createOvertimeEntry = async (req, res) => {
  try {
    const { employeeId, overtime_date, overtime_hours, reason } = req.body;
    const validationError = validateOvertimePayload({
      employeeId,
      overtime_date,
      overtime_hours,
      reason,
    });

    if (validationError) {
      return res.status(422).json({ msg: validationError });
    }

    const worker = await EmployeeData.findByPk(employeeId);
    if (!worker) {
      return res.status(404).json({ msg: "Worker not found." });
    }

    const existingEntry = await OvertimeEntry.findOne({
      where: {
        employeeId,
        overtime_date,
      },
    });

    if (existingEntry) {
      return res
        .status(409)
        .json({ msg: "An overtime entry already exists for this worker and date." });
    }

    const overtimeDateObj = new Date(overtime_date);
    const monthStart = new Date(
      overtimeDateObj.getFullYear(),
      overtimeDateObj.getMonth(),
      1,
    );
    const monthEnd = new Date(
      overtimeDateObj.getFullYear(),
      overtimeDateObj.getMonth() + 1,
      0,
    );

    const currentMonthlyHours =
      (await OvertimeEntry.sum("overtime_hours", {
        where: {
          employeeId,
          overtime_date: {
            [Op.gte]: toIsoDate(monthStart),
            [Op.lte]: toIsoDate(monthEnd),
          },
        },
      })) || 0;

    const newMonthlyTotal = currentMonthlyHours + Number(overtime_hours);
    if (newMonthlyTotal > MONTHLY_OVERTIME_LIMIT) {
      return res.status(422).json({
        msg: `Monthly overtime limit exceeded. This entry would make ${newMonthlyTotal} hours, above ${MONTHLY_OVERTIME_LIMIT}.`,
      });
    }

    await OvertimeEntry.create({
      employeeId,
      overtime_date,
      overtime_hours: Number(overtime_hours),
      reason: reason.trim(),
      payroll_status: "submitted",
    });

    return res.status(201).json({ msg: "Overtime entry submitted for payroll processing." });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getOvertimeEntries = async (_req, res) => {
  try {
    const entries = await OvertimeEntry.findAll({
      attributes: [
        "id",
        "employeeId",
        "overtime_date",
        "overtime_hours",
        "reason",
        "payroll_status",
        "createdAt",
      ],
      include: [
        {
          model: EmployeeData,
          attributes: ["employee_name", "national_id", "position"],
        },
      ],
      order: [["overtime_date", "DESC"]],
    });

    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
