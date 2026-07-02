require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const SECRET = process.env.DESSERT_SECRET;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/dessert', async (req, res) => {
  const raw = req.body && req.body.dessert;
  if (!raw || typeof raw !== 'string') {
    return res.status(400).json({ error: 'invalid' });
  }
  const dessert = raw.trim();
  if (!dessert) return res.status(400).json({ error: 'invalid' });

  if (dessert.toLowerCase() === SECRET.toLowerCase()) {
    return res.json({ success: true, message: 'Yes. All glory to Czechoslovakia' });
  }

  await supabase.from('failed_guesses').insert({ dessert });

  return res.json({
    success: false,
    message: `Ew, no, ${dessert} sucks. Your tastes are awful and you're a terrible person`
  });
});

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Turbo interface running → http://localhost:${PORT}`);
  });
}

module.exports = app;
