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
  const isAntigravity = title.toLowerCase().includes('antigravity');
  const returnPage = isAntigravity ? '/cursos-antigravity.html' : '/#cursos';

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
          success: `https://${req.get('host')}${returnPage}`,
          failure: `https://${req.get('host')}/#cursos`,
          pending: `https://${req.get('host')}/#cursos`
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

// Endpoint to submit to Google Sheets via Apps Script Web App
app.post('/api/submit-sheet', async (req, res) => {
  const { fullName, email, dni, course } = req.body;
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    console.warn('Advertencia: GOOGLE_SCRIPT_URL no está configurada en el archivo .env. Simulando guardado exitoso.');
    return res.json({ status: 'success', message: 'Datos guardados (simulado, configura GOOGLE_SCRIPT_URL en .env para producción).' });
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email, dni, course })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error forwarding data to Google Sheets:', error);
    res.status(500).json({ error: 'Error al comunicarse con Google Sheets' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en https://www.spectracode.site:${PORT}`);
});
