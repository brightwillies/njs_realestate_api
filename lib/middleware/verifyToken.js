import jwt from "jsonwebtoken"
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const verifyToken = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not Authenticated" });

    jwt.verify(token, SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.userId = payload.id;
        next();
        //     if(payload.isAdmin) {
        //         res.status(200).json({ message: "You are an admin" });
        //   } else{
        //   res.status(200).json({ message: "You are not and admin" });
        //   }

    });
}