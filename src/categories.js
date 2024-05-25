const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// Create Category
router.post('/', authenticate, async (req, res) => {
    const { name } = req.body;
    const category = await prisma.category.create({
        data: { name }
    });
    res.json(category);
});

// Read Categories
router.get('/', authenticate, async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});

module.exports = router;
