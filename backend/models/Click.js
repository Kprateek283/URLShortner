import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
    shortId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    ip: String,
    browser: { type: String },
    os: { type: String },
    deviceType: { type: String, required: true }, // Must be provided
});

export default mongoose.model('Click', clickSchema);
