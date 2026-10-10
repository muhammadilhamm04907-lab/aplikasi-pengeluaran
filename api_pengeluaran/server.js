// server.js
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();

app.use(cors()); // izinkan akses dari aplikasi mobile
app.use(express.json()); // baca body berformat JSON

const dataPengeluaran = `
  SELECT p.id, p.judul, p.nominal, p.tanggal, p.catatan,
         p.id_kategori, k.nama AS kategori
  FROM pengeluaran p
  LEFT JOIN kategori k ON k.id = p.id_kategori
`;

function validasiNominal(value) {
  const nominal = Number(value);
  return Number.isInteger(nominal) && nominal > 0 && nominal <= 2147483647
    ? nominal
    : null;
}

function validasiIdKategori(value) {
  if (value === undefined || value === null || value === '') return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

// ambil seluruh data
app.get('/pengeluaran', async (req, res) => {
  const [rows] = await pool.query(`${dataPengeluaran} ORDER BY p.tanggal DESC, p.id DESC`);
  res.json(rows);
});

// ambil satu data berdasarkan id
app.get('/pengeluaran/:id', async (req, res) => {
  const [rows] = await pool.execute(`${dataPengeluaran} WHERE p.id = ?`, [req.params.id]);
  if (!rows.length) {
    return res.status(404).json({ pesan: 'Data tidak ditemukan' });
  }
  res.json(rows[0]);
});

app.get('/kategori', async (req, res) => {
  const [rows] = await pool.query('SELECT id, nama FROM kategori ORDER BY nama');
  res.json(rows);
});

app.post('/pengeluaran', async (req, res) => {
  const judulBaru = typeof req.body?.judul === 'string' ? req.body.judul.trim() : '';
  const nominalBaru = validasiNominal(req.body?.nominal);
  const idKategori = validasiIdKategori(req.body?.id_kategori);
  if (!judulBaru) {
    return res.status(400).json({ pesan: 'judul wajib diisi' });
  }
  if (judulBaru.length > 100) {
    return res.status(400).json({ pesan: 'judul maksimal 100 karakter' });
  }
  if (nominalBaru === null) {
    return res.status(400).json({ pesan: 'nominal harus berupa bilangan bulat dari 1 sampai 2147483647' });
  }
  if (idKategori === undefined) {
    return res.status(400).json({ pesan: 'id_kategori tidak valid' });
  }
  if (idKategori !== null) {
    const [categories] = await pool.execute('SELECT id FROM kategori WHERE id = ?', [idKategori]);
    if (!categories.length) {
      return res.status(400).json({ pesan: 'Kategori tidak ditemukan' });
    }
  }

  const [result] = await pool.execute(
    'INSERT INTO pengeluaran (judul, nominal, id_kategori) VALUES (?, ?, ?)',
    [judulBaru, nominalBaru, idKategori],
  );
  const [rows] = await pool.execute(`${dataPengeluaran} WHERE p.id = ?`, [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/pengeluaran/:id', async (req, res) => {
  const [existing] = await pool.execute(
    'SELECT id, judul, nominal FROM pengeluaran WHERE id = ?',
    [req.params.id],
  );
  if (!existing.length) {
    return res.status(404).json({ pesan: 'Data tidak ditemukan' });
  }

  const judulBaru = req.body?.judul === undefined
    ? existing[0].judul
    : typeof req.body.judul === 'string' ? req.body.judul.trim() : '';
  const nominalBaru = req.body?.nominal === undefined
    ? Number(existing[0].nominal)
    : validasiNominal(req.body.nominal);
  if (!judulBaru) {
    return res.status(400).json({ pesan: 'judul wajib diisi' });
  }
  if (judulBaru.length > 100) {
    return res.status(400).json({ pesan: 'judul maksimal 100 karakter' });
  }
  if (nominalBaru === null) {
    return res.status(400).json({ pesan: 'nominal harus berupa bilangan bulat dari 1 sampai 2147483647' });
  }

  await pool.execute(
    'UPDATE pengeluaran SET judul = ?, nominal = ? WHERE id = ?',
    [judulBaru, nominalBaru, req.params.id],
  );
  const [rows] = await pool.execute(`${dataPengeluaran} WHERE p.id = ?`, [req.params.id]);
  res.json(rows[0]);
});

app.delete('/pengeluaran/:id', async (req, res) => {
  const [result] = await pool.execute('DELETE FROM pengeluaran WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) {
    return res.status(404).json({ pesan: 'Data tidak ditemukan' });
  }
  res.status(204).end();
});

app.use((err, req, res, next) => {
  console.error('Kesalahan API:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ pesan: 'Terjadi kesalahan pada server' });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
