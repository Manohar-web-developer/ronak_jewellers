import { AdminModel } from "../models/adminpanel/admin.js" ;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;

export const register = async (req, res) => {
    try {
        const { name, mobile, password, email } = req.body;

        if (!name || !mobile || !password || !email) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }
        const formattedEmail = email.toLowerCase().trim()
        const userExists = await AdminModel.findOne({ $or: [{ mobile }, { email: formattedEmail }] });
        if (userExists) {
            return res.status(400).json({
                status: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new AdminModel({
            name,
            mobile,
            email: formattedEmail,
            passwordHash: hashedPassword,
            isActive: true
        });

        await newUser.save();

        return res.status(201).json({
            status: true,
            message: "User registered successfully",
            result: {
                name: newUser.name,
                mobile: newUser.mobile,
                email: newUser.email,
            },
        });


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

export const login = async (req, res) => {

    try {
        const { mobile, password, email } = req.body;

        if (!mobile || !password || !email) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            })

        }
        const formattedEmail = email.toLowerCase().trim()
        const AdminFind = await AdminModel.findOne({
            email: formattedEmail,
            mobile: mobile,
            isActive: true
        })

        if (!AdminFind) {
            return res.status(400).json({
                status: false,
                message: "Email / Mobile Not Valied "
            })
        }
        const checkPassword = await bcrypt.compare(password, AdminFind.passwordHash)

        if (!checkPassword) {
            return res.status(400).json({
                status: false,
                message: "Password Not Correct"
            })
        }

        const token = jwt.sign(
            {
                id: AdminFind._id,
                email: AdminFind.email,
                mobile: AdminFind.mobile
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        return res.status(200).json({
            status: true,
            token: token,
            message: "Login successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Internal Error"
        })
    }









}

export const details = async (req, res) => {
    const user = req.user;

    return res.status(200).json({
        status: true,
        message: "User Details Fetched Successfully",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        }
    });
};

export const changePassword = async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        if(!currentPassword || !newPassword){
              return res.status(404).json({
                status: false,
                message: "All field"
            });
        }

        const dbPassword = await AdminModel.findById(user.id).select("passwordHash");

        if (!dbPassword) {
            return res.status(404).json({
                status: false,
                message: "Admin not found"
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            dbPassword.passwordHash
        )

        if (!isMatch) {
            return res.status(401).json({
                status: false,
                message: "currentPassword is wrong"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await AdminModel.findByIdAndUpdate(user.id, {
            passwordHash: hashedPassword
        })

        return res.status(200).json({
            status: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Internal Error",

        });
    }


}

