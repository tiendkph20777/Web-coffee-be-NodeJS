import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/users";
import { signupSchema, signinSchema } from "../schemas/auth";

dotenv.config()
//đăng ký
export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const { error } = signupSchema.validate(req.body, { abortEarly: false });

        //check validate
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors.message,
            });
        }

        // kiểm tra tồn tại email
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "Email đã tồn tại",
            });
        }

        //tạo bảo mật cho passwwork với brcypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        user.password = undefined;

        //tạo token từ server 
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 })

        return res.status(201).json({
            message: "Đăng ký thành công",
            accessToKen: token,
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

//đăng nhập
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = signinSchema.validate(req.body, { eboutEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message)
            return res.status(400).json({
                message: errors.message,

            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "tài khoản không tồn tại" })
        }
        const isMath = await bcrypt.compare(password, user.password)
        if (!isMath) {
            return res.status(400).json({
                message: "sai mật khẩu"
            })
        }
        user.password = undefined
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 })

        return res.status(200).json({
            message: "đăng nhập thành công",
            accessToken: token,
            user,
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}


/** 
 * singin
 * 
 * bước 1 : nhận request từ client gửi lên
 * bước 2 : kiểm tra cú pháp của request(validate)
 * bước 3: kiểm tra xem email đã có trong db chưa ? nếu tồn tại thì trả về thông báo 
 * bước 4 : so sánh mật khẩu từ client gửi lên với mật khẩu trong db (compare trong brcypt)
 * bước 5 : nếu mật khẩu không khớp thì trả về thông báo 
 * bước 6 : tạo token và trả về client bao gồm thông tin user và token
 */