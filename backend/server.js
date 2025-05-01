require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.routes.js")
const incomeRoutes = require("./routes/income.routes.js")
const expenseRoutes = require("./routes/expense.route.js")
const dashboardRoutes = require("./routes/dashboard.route.js")
const app = express();

// Middleware to handle CORS
app.use(cors({
    origin : process.env.CLIENT_URL || "*",
    methods : ["GET","POST", "PUT", "DELETE"],
    allowedHeaders : ["Content-Type", "Authorization"]
}));

app.use(express.json());

connectDB();

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/income",incomeRoutes)
app.use("/api/v1/expense",expenseRoutes)
app.use("/api/v1/dashboard",dashboardRoutes)

//serve uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));