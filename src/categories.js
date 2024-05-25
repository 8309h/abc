const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const authenticate = require('../middleware/auth.middleware')

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
