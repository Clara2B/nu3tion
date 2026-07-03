const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/product', (req, res) => {
  const product = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  res.json(product);
});

app.post('/api/checkout', (req, res) => {
  const { customer, items, paymentMethod } = req.body || {};

  if (!customer || !customer.name || !customer.email || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Dados incompletos para finalizar o pedido.' });
  }

  const orderNumber = `NU${Date.now().toString().slice(-8)}`;
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const order = {
    orderNumber,
    customer,
    items,
    paymentMethod: paymentMethod || 'pix',
    total: Number(total.toFixed(2)),
    status: 'demonstracao',
    createdAt: new Date().toISOString()
  };

  let orders = [];
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    } catch (err) {
      orders = [];
    }
  }
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  res.json({
    success: true,
    orderNumber,
    total: order.total,
    estimatedDelivery: estimatedDelivery.toLocaleDateString('pt-BR')
  });
});

app.listen(PORT, () => {
  console.log(`Nu3tion (site modelo) rodando em http://localhost:${PORT}`);
});
