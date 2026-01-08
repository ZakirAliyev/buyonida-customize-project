require("dotenv").config();
const connectDb = require("./db");

connectDb();

const express = require("express");
const cors = require("cors");
const pageRoutes = require("./routes/page.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", pageRoutes);

app.listen(5000, () => {
    console.log("✅ Backend running on http://localhost:5000");
});
