require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);
const supabase = require('./supabase/client.js');

const server = http.createServer(async (req, res) => {
  const parsedURL = url.parse(req.url, true);

  const pathname = parsedURL.pathname;

  let filePath = path.join(
    __dirname,
    'public',
    pathname === '/' ? 'index.html' : pathname
  );

  if (path.extname(filePath) === '') {
    filePath = filePath + '.html';
  }

  // Content Types
  const extensionName = path.extname(filePath);
  let contentType = 'text/html';

  switch (extensionName) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
  }

  if (req.url.startsWith('/api/products')) {
    try {
      if (parsedURL.query.limit) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(parsedURL.query.limit);

        if (error) {
          console.error('Error fetching products:', error.message);
          return [];
        }

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      }

      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        console.error('Error fetching products:', error.message);
        return [];
      }

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }

    return;
  }

  if (req.url.startsWith('/api/single-product')) {
    const { id } = parsedURL.query;

    try {
      const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', id);

      console.log(id);

      if (error) {
        console.error('Error fetching products:', error.message);
        return [];
      }

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }

    return;
  }

  if (req.url.startsWith('/create-checkout-session') && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body = body + chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { cartItems } = JSON.parse(body);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: cartItems.map((item) => ({
            price_data: {
              currency: 'usd',
              product_data: { name: item.name },
              unit_amount: item.price * 100, // в центах
            },
            quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: 'http://localhost:3000/success.html',
          cancel_url: 'http://localhost:3000/cancel.html',
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: session.url }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });

    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'content-type': contentType });
      res.end(content);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running...');
});
