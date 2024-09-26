import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_SECRET_KEY;

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    // asic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ message: "Username must be between 3 and 20 characters" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user  and save it
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        // console.log(newUser);
        res.status(201).json({ newUser, message: "user created successfully" });


    } catch (error) {
        // console.log(error);
        res.status(500).json({ error, message: "failed  to save user" })
    }

}

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) return res.status(401).json({
            message: "Invalid credentials"
        })
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign(
            {
                id: user.id,
                isAdmin:false
            }, jwtKey,
            { expiresIn: age }
        );

        const {password:userPassword, ...userInfo} =  user;
                   res.cookie("token", token, {
            httpOnly: true,
            maxAge: age
        }).status(200)
            .json({  userInfo,    message: "Login Successful " })

    } catch (error) {
        // console.log(error)
        res.status(500).json({     message: "failed  to login" })
    }


}
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "logout" });

}

