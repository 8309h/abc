const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const storedToken = await prisma.token.findUnique({
        where: { token }
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
        return res.status(401).send('Invalid or expired token');
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

module.exports = authenticate;
