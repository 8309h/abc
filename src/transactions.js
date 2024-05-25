const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate the user
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

// Create Transaction
router.post('/', authenticate, async (req, res) => {
    const { amount, type, categoryId } = req.body;
    const transaction = await prisma.transaction.create({
        data: {
        amount,
        type,
        categoryId,
        userId: req.userId,
        }
    });
    res.json(transaction);
});

// Read Transactions
router.get('/', authenticate, async (req, res) => {
    const transactions = await prisma.transaction.findMany({
        where: { userId: req.userId },
        include: { category: true }
    });
    res.json(transactions);
});

// Update Transaction
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { amount, type, categoryId } = req.body;
    const transaction = await prisma.transaction.update({
        where: { id: parseInt(id) },
        data: { amount, type, categoryId }
    });
    res.json(transaction);
});

// Delete Transaction
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    await prisma.transaction.delete({
        where: { id: parseInt(id) }
    });
    res.send('Transaction deleted');
});

module.exports = router;
