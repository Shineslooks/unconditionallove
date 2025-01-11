const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import model User
const router = express.Router();

// Fungsi untuk menghasilkan username unik
const generateUsername = (name) => {
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${name.toLowerCase().replace(/\s/g, '')}${randomNumber}`;
};

// Fungsi untuk menghasilkan password unik
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};

// Endpoint pendaftaran
router.post('/register', async (req, res) => {
    try {
        const { name, church } = req.body;

        // Cek jumlah peserta
        const count = await User.countDocuments();
        if (count >= 400) {
            return res.status(400).json({ message: 'Pendaftaran sudah ditutup.' });
        }

        // Generate username dan password
        const username = generateUsername(name);
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan ke database
        const user = new User({
            name,
            church,
            username,
            password: hashedPassword,
        });
        await user.save();

        // Kirimkan username dan password ke pendaftar
        res.status(201).json({
            message: 'Pendaftaran berhasil!',
            username,
            password,
        });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server.', error: err.message });
    }
});

module.exports = router;
