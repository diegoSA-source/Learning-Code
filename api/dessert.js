const { createClient } = require('@supabase/supabase-js');

const SECRET = process.env.DESSERT_SECRET;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

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
};
