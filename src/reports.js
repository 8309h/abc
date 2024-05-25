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

// Generate Monthly Report
router.get('/monthly', authenticate, async (req, res) => {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await prisma.transaction.findMany({
        where: {
        userId: req.userId,
        date: {
            gte: startDate,
            lte: endDate,
        },
        },
        include: { category: true }
    });

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    const report = {
        income,
        expenses,
        balance: income - expenses,
        transactions
    };

    res.json(report);
});

module.exports = router;
