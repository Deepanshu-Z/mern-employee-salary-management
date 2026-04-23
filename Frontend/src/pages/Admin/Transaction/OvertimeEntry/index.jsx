import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../layout";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { getMe } from "../../../../config/redux/action";

const initialForm = {
  employeeId: "",
  overtime_date: "",
  overtime_hours: "",
  reason: "",
};

const OvertimeEntry = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [workers, setWorkers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const validate = () => {
    const currentErrors = {};

    if (!form.employeeId) currentErrors.employeeId = "Worker is required.";
    if (!form.overtime_date) currentErrors.overtime_date = "Date is required.";
    if (!form.overtime_hours && form.overtime_hours !== 0) {
      currentErrors.overtime_hours = "Overtime hours are required.";
    }
    if (!form.reason.trim()) currentErrors.reason = "Reason is required.";

    const hoursNumber = Number(form.overtime_hours);
    if (!currentErrors.overtime_hours) {
      if (!Number.isInteger(hoursNumber)) {
        currentErrors.overtime_hours = "Overtime hours must be a whole number.";
      } else if (hoursNumber < 1 || hoursNumber > 6) {
        currentErrors.overtime_hours = "Overtime hours must be between 1 and 6.";
      }
    }

    if (!currentErrors.overtime_date) {
      const overtimeDate = new Date(form.overtime_date);
      overtimeDate.setHours(0, 0, 0, 0);

      if (Number.isNaN(overtimeDate.getTime())) {
        currentErrors.overtime_date = "Please provide a valid date.";
      } else if (overtimeDate > today) {
        currentErrors.overtime_date = "Date cannot be in the future.";
      } else {
        const minAllowedDate = new Date(today);
        minAllowedDate.setDate(today.getDate() - 7);
        if (overtimeDate < minAllowedDate) {
          currentErrors.overtime_date = "Date cannot be more than 7 days in the past.";
        }
      }
    }

    if (!currentErrors.reason && form.reason.trim().length < 10) {
      currentErrors.reason = "Reason must be at least 10 characters.";
    }

    return currentErrors;
  };

  const fetchWorkers = async () => {
    const response = await axios.get("http://localhost:5000/employee_data");
    setWorkers(response.data);
  };

  const fetchEntries = async () => {
    const response = await axios.get("http://localhost:5000/overtime_entries");
    setEntries(response.data);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/overtime_entries", {
        employeeId: Number(form.employeeId),
        overtime_date: form.overtime_date,
        overtime_hours: Number(form.overtime_hours),
        reason: form.reason.trim(),
      });

      await fetchEntries();
      setForm(initialForm);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Overtime entry submitted for payroll processing.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: error?.response?.data?.msg || "Failed to submit overtime entry.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
      return;
    }
    if (user && user.access_role !== "admin") {
      navigate("/dashboard");
      return;
    }
    if (user?.access_role === "admin") {
      fetchWorkers();
      fetchEntries();
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <Breadcrumb pageName="Overtime Entry" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 mt-6">
        <h3 className="mb-4 font-medium text-black dark:text-white">
          Log Worker Overtime
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-black dark:text-white">Worker</label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">Select Worker</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.employee_name} ({worker.national_id})
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="mt-1 text-sm text-danger">{errors.employeeId}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-black dark:text-white">Date</label>
            <input
              type="date"
              name="overtime_date"
              value={form.overtime_date}
              onChange={handleChange}
              className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            />
            {errors.overtime_date && (
              <p className="mt-1 text-sm text-danger">{errors.overtime_date}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-black dark:text-white">Overtime Hours</label>
            <input
              type="number"
              name="overtime_hours"
              min="1"
              max="6"
              value={form.overtime_hours}
              onChange={handleChange}
              placeholder="1 - 6"
              className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            />
            {errors.overtime_hours && (
              <p className="mt-1 text-sm text-danger">{errors.overtime_hours}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-black dark:text-white">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={4}
              placeholder="Explain why overtime is needed..."
              className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-danger">{errors.reason}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <ButtonOne type="submit" disabled={submitting}>
              <span>{submitting ? "Submitting..." : "Submit Overtime"}</span>
            </ButtonOne>
          </div>
        </form>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 mt-6">
        <h3 className="mb-4 font-medium text-black dark:text-white">Recent Overtime Entries</h3>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-3 px-4 font-medium text-black dark:text-white">Worker</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Date</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Hours</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Reason</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-[#eee] dark:border-strokedark">
                  <td className="py-3 px-4 text-black dark:text-white">
                    {entry.employee_data?.employee_name || "-"}
                  </td>
                  <td className="py-3 px-4 text-black dark:text-white">{entry.overtime_date}</td>
                  <td className="py-3 px-4 text-black dark:text-white">{entry.overtime_hours}</td>
                  <td className="py-3 px-4 text-black dark:text-white">{entry.reason}</td>
                  <td className="py-3 px-4 text-black dark:text-white">{entry.payroll_status}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-4 text-center text-black dark:text-white"
                  >
                    No overtime entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default OvertimeEntry;
