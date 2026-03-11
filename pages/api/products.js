// products.js: archivo principal de la tienda headless.
import { getProducts } from '../../lib/api';

export default async function handler(req, res) {
  try {
    const data = await getProducts(req.query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error loading products' });
  }
}
