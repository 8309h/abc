const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT Token with Expiry
const generateToken = (userId) => {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
    return { token, expiresAt };
};

// User Registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    res.json(user);
});

// User Authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send('Invalid email or password');
    }

    const { token, expiresAt } = generateToken(user.id);

    await prisma.token.create({
        data: { token, userId: user.id, expiresAt }
    });
    
    res.json({ token });
});

// User Logout
router.post('/logout', async (req, res) => {
    const { token } = req.body;

    await prisma.token.deleteMany({
        where: { token }
    });

    res.send('Logged out successfully');
});

module.exports = router;
