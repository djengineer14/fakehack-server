const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for the HTML page)
app.use(express.static('public'));

// Store received data in memory (for demo purposes)
let receivedData = [];

// Endpoint to receive data from Roblox script
app.post('/api/webhook', (req, res) => {
    const data = req.body;
    
    // Add timestamp if not provided
    if (!data.timestamp) {
        data.timestamp = new Date().toISOString();
    }
    
    // Store the data
    receivedData.push(data);
    
    // Log to console (visible in Render logs)
    console.log('📥 Received prank data:');
    console.log(JSON.stringify(data, null, 2));
    console.log('✅ Data stored. Total entries:', receivedData.length);
    
    // Send response back to Roblox
    res.status(200).json({
        success: true,
        message: 'Data received successfully!',
        totalEntries: receivedData.length
    });
});

// Endpoint to get all received data (for the HTML page)
app.get('/api/data', (req, res) => {
    res.status(200).json({
        success: true,
        count: receivedData.length,
        data: receivedData
    });
});

// Endpoint to clear data (optional)
app.delete('/api/data', (req, res) => {
    receivedData = [];
    res.status(200).json({
        success: true,
        message: 'All data cleared'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 View data at: http://localhost:${PORT}`);
});
