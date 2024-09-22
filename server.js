const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const app = express();
connectDB();
app.use(cors({
    origin: ['http://localhost:3000'],
    // origin: ['http://localhost:3000'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
// app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/brands", require("./routes/brandRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use('/api/cars', require("./routes/carRoutes"));
app.use('/api/variants', require("./routes/variantRoutes"));
app.use('/api/vehicles', require("./routes/vehicleRoutes"));
app.use('/api/attributes', require("./routes/attributeRoutes"));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});