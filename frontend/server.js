const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        console.log('Received form data:', req.body);
        console.log('Sending to backend:', BACKEND_URL);
        
        const response = await axios.post(`${BACKEND_URL}/register`, req.body, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        res.json({
            success: true,
            message: response.data.message,
            data: response.data.user
        });
    } catch (error) {
        console.error('Error submitting to backend:', error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to register user. Please try again.'
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
    console.log(`Backend URL: ${BACKEND_URL}`);
});