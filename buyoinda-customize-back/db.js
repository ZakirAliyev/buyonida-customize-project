const mongoose = require("mongoose");

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "tykla",
        });

        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ Mongo connection error:", err.message);
        process.exit(1);
    }
}

module.exports = connectDb;
