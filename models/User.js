const mongoose = require('mongoose');

// Definisi model data
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    church: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Ekspor model User
module.exports = mongoose.model('User', UserSchema);
