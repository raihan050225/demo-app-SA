const express = require('express');
require('dotenv').config();
const connectDB = require('./config.js/db');
const userRoutes = require('./routes/user.routes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error('Failed to start server due to DB connection error:', err.message);
    process.exit(1);
});