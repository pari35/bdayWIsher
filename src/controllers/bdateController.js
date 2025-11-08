import { addBdateService } from "../services/bdateService.js";

const addBdateController = async (req, res) => {
    try {
        console.log("in controller");
        
        const userRegData = req.body;
        const regUser = await addBdateService(userRegData);

        res.status(201).json({
            success: true,
            message: "User added successfully",
            data: regUser,
        });
    } catch (err) {
        console.error("Error in addBdateController:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export {
    addBdateController
}