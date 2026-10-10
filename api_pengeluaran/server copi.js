// server.js
import express from 'express';
import cors from 'cors';
import { Router } from 'express';
import { pool } from '../db.js';


const app = express();

app.use(cors()); // izinkan akses dari aplikasi mobile
app.use(express.json()); // baca body berformat JSON





const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

