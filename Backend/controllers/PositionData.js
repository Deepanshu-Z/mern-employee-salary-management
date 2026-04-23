import PositionData from "../models/PositionDataModel.js";
import EmployeeData from "../models/EmployeeDataModel.js";
import { Op } from "sequelize";

// display semua data position
export const getPositionData = async (req, res) => {
    try {
        let response;
        if (req.access_role === "admin") {
            response = await PositionData.findAll({
                attributes: ['id', 'position_name', 'base_salary', 'transport_allowance', 'meal_allowance'],
                include: [{
                    model: EmployeeData,
                    attributes: ['employee_name', 'username', 'access_role'],
                }]
            });
        } else {
            if (req.userId !== PositionData.userId) return res.status(403).json({ msg: "Access forbidden" });
            await PositionData.update({
                position_name, base_salary, transport_allowance, meal_allowance
            }, {
                where: {
                    [Op.and]: [{ position_id: position.position_id }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// method for display data position by ID
export const getPositionDataByID = async (req, res) => {
    try {
        const response = await PositionData.findOne({
            attributes: [
                'id','position_name', 'base_salary', 'transport_allowance', 'meal_allowance'
            ],
            where: {
                id: req.params.id
            }
        });
        if(response){
            res.status(200).json(response);
        }else{
            res.status(404).json({msg: 'Data position with ID that not found'});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// method for tambah data position
export const createPositionData = async (req, res) => {
    const {
        position_id, position_name, base_salary, transport_allowance, meal_allowance
    } = req.body;
    try {
        if (req.access_role === "admin") {
            await PositionData.create({
                position_id: position_id,
                position_name: position_name,
                base_salary: base_salary,
                transport_allowance: transport_allowance,
                meal_allowance: meal_allowance,
                userId: req.userId
            });
        } else {
            if (req.userId !== PositionData.userId) return res.status(403).json({ msg: "Access forbidden" });
            await PositionData.update({
                position_name, base_salary, transport_allowance, meal_allowance
            }, {
                where: {
                    [Op.and]: [{ position_id: position.position_id }, { userId: req.userId }]
                },
            });
        }
        res.status(201).json({ success: true, message: "Data Position Berhasil di Simpan" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }

}

// method for update data position
export const updatePositionData = async (req, res) => {
    try {
        const position = await PositionData.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!position) return res.status(404).json({ msg: "Data not found" });
        const { position_name, base_salary, transport_allowance, meal_allowance } = req.body;
        if (req.access_role === "admin") {
            await PositionData.update({
                position_name, base_salary, transport_allowance, meal_allowance
            }, {
                where: {
                    id: position.id
                }
            });
        } else {
            if (req.userId !== PositionData.userId) return res.status(403).json({ msg: "Access forbidden" });
            await PositionData.update({
                position_name, base_salary, transport_allowance, meal_allowance
            }, {
                where: {
                    [Op.and]: [{ position_id: position.position_id }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: "Data Position Berhasil di Pebarui" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// method for delete data position
export const deletePositionData = async (req, res) => {
    try {
        const position = await PositionData.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!position) return res.status(404).json({ msg: "Data not found" });
        if (req.access_role === "admin") {
            await position.destroy({
                where: {
                    id: position.id
                }
            });
        } else {
            if (req.userId !== position.userId) return res.status(403).json({ msg: "Access forbidden" });
            await position.destroy({
                where: {
                    [Op.and]: [{ position_id: position.position_id }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: "Data Position Berhasil di Hapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}