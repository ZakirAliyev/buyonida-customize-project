const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: String,
    template: String,
    settings: mongoose.Schema.Types.Mixed,
    children: [Object]
});

const SectionSchema = new mongoose.Schema({
    id: Number,
    type: String,
    settings: mongoose.Schema.Types.Mixed,
    blocks: [BlockSchema]
});

const HomePageSchema = new mongoose.Schema({
    page: String,
    sections: [SectionSchema]
});

module.exports = mongoose.model("HomePage", HomePageSchema);
