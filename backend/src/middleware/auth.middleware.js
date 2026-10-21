
import jwt from "jsonwebtoken";
import { AdminModel } from "../models/adminpanel/admin.js";


const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        const { id } = decoded;

        const user = await AdminModel.findById(id);

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User Not found"
            })
        }

        if (!user.isActive) {
            return res.status(403).json({
                status: false,
                message: "Your Account is not active"
            })
        }

        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        };
        next();


    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}

export default authMiddleware;