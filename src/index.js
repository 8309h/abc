const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRoutes = require('./auth');
const transactionRoutes = require('./transactions');
const budgetRoutes = require('./budgets');
const reportRoutes = require('./reports');
const categoriesRoutes = require('./categories');
const currencyRoutes = require('./currency');


const app = express();
// const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
// const JWT_SECRET = process.env.JWT_SECRET;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/budgets', budgetRoutes);
app.use('/report', reportRoutes);
app.use('/categories', categoriesRoutes);
app.use('/currency', currencyRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
