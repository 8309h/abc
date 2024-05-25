const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const authenticate = require('../middleware/auth.middleware')

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
