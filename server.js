import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Initialize Mercado Pago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// Endpoint to create preference
app.post('/api/create-preference', async (req, res) => {
  const { title, price } = req.body;

  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            title: title,
            quantity: 1,
            unit_price: Number(price),
            currency_id: 'ARS'
          }
        ],
        back_urls: {
          success: `${req.protocol}://${req.get('host')}/#cursos`,
          failure: `${req.protocol}://${req.get('host')}/#cursos`,
          pending: `${req.protocol}://${req.get('host')}/#cursos`
        },
        auto_return: 'approved'
      }
    });

    res.json({ initPoint: result.init_point });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
