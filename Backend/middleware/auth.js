import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to protect routes that require login.
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

export const authenticateAdmin = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    });
};

export { SECRET_KEY };
