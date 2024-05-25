const express = require('express');
const axios = require('axios');

const router = express.Router();
const FIXER_API_KEY = process.env.FIXER_API_KEY;

// Convert Currency
router.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;
    try {
        const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=${to}&base=${from}`);
        const rate = response.data.rates[to];
        const convertedAmount = amount * rate;
        res.json({ convertedAmount });
    } catch (error) {
        res.status(500).send('Error converting currency');
    }
});

module.exports = router;
