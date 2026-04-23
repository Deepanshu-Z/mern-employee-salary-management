import EmployeeData from '../models/EmployeeDataModel.js'

export const verifyUser = async(req, res, next) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Please log in to your account!"});
    }
    try {
        const employee = await EmployeeData.findOne({
            where: {
                employee_id: req.session.userId
            }
        });
        if(!employee) return res.status(404).json({msg: "User not found"});
        req.userId = employee.id;
        req.access_role = employee.access_role;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "A server error occurred" });
    }
}

export const adminOnly = async (req, res, next) => {
    try {
        const employee = await EmployeeData.findOne({
            where:{
                employee_id: req.session.userId
            }
        });
        if(!employee) return res.status(404).json({msg: "Employee data not found"});
        if(employee.access_role !== "admin") return res.status(403).json({msg: "Access forbidden"});
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "A server error occurred" });
    }
}