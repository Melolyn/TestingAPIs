const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 5757;
const mongoURI = 'mongodb://localhost:27017/Marketplace';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));



// Define the product schema and model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  quantity: Number,
  category: String
});

const Product = mongoose.model('Product', productSchema); // Use 'Product' (capitalized)

// Routes
app.get('/', (req, res) => {
  res.send("Welcome to Marketplace :)");
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); // Use 'Product' model here
    res.json(products);
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});

// Get a product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Use 'Product' model here
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  } catch (err) {
    res.status(500).send('Error fetching product');
  }
});

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body); // Use 'Product' model here
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).send('Error saving product');
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  } catch (err) {
    res.status(500).send('Error updating product');
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).send('Error deleting product');
  }
});

//Delete all products 

app.delete('/api/products/', async (req, res) => {
  try {
    const product = await Product.deleteMany({});
    res.json({ message: 'All products deleted' });
  } catch (err) {
    res.status(500).send('Error deleting product');
  }
});



// Handle unknown routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start the server
app.listen(HTTP_PORT, () => {
  console.log('Ready to handle requests on port ' + HTTP_PORT);
});
