require('dotenv').config(); // Memuat file .env

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Middleware untuk parsing JSON

// Koneksi ke MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Terhubung ke MongoDB Atlas'))
    .catch((err) => console.error('Kesalahan koneksi:', err));

// Route sederhana untuk memastikan server berjalan
app.get('/', (req, res) => {
    res.send('Server berjalan dengan baik!');
});

// Port aplikasi
const PORT = process.env.PORT || 3000;

// Import route files
const web1Routes = require('./routes/routesweb1');
const web2Routes = require('./routes/routesweb2');

// Middleware untuk routes
app.use('/web1', web1Routes); // Route untuk routesweb1
app.use('/web2', web2Routes); // Route untuk routesweb2

// Route 404 jika tidak ditemukan
app.use((req, res) => {
    res.status(404).send('Route tidak ditemukan!');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
