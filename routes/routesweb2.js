const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User
const router = express.Router();

// Secret key untuk JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Login peserta
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password harus diisi.' });
        }

        // Cari pengguna berdasarkan username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Username tidak ditemukan.' });
        }

        // Cek apakah password valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password salah.' });
        }

        // Buat token JWT
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login berhasil!', token });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server.', error: err.message });
    }
});

// Generate tiket
router.get('/ticket', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Ambil token dari header Authorization
        const decoded = jwt.verify(token, JWT_SECRET); // Verifikasi token

        // Jika token valid, kirimkan tiket
        const ticketText = `Tiket untuk: ${decoded.username}`;
        res.status(200).send(`
            <div style="text-align: center; font-family: Arial, sans-serif;">
                <h1>Selamat Datang!</h1>
                <p>${ticketText}</p>
                <img src="https://via.placeholder.com/300?text=${encodeURIComponent(ticketText)}" alt="Tiket">
            </div>
        `);
    } catch (err) {
        res.status(401).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
    }
});

module.exports = router;
