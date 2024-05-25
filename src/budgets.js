const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const authenticate = require('../middleware/auth.middleware')

// Create Budget
router.post('/', authenticate, async (req, res) => {
    const { amount, startDate, endDate } = req.body;
    const budget = await prisma.budget.create({
        data: {
        amount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: req.userId,
        }
    });
    res.json(budget);
});

// Read Budgets
router.get('/', authenticate, async (req, res) => {
    const budgets = await prisma.budget.findMany({
        where: { userId: req.userId }
    });
    res.json(budgets);
});

// Update Budget
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { amount, startDate, endDate } = req.body;
    const budget = await prisma.budget.update({
        where: { id: parseInt(id) },
        data: { amount, startDate: new Date(startDate), endDate: new Date(endDate) }
    });
    res.json(budget);
});

// Delete Budget
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    await prisma.budget.delete({
        where: { id: parseInt(id) }
    });
    res.send('Budget deleted');
});

module.exports = router;
