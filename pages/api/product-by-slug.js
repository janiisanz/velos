// product-by-slug.js: archivo principal de la tienda headless.
import { getProductBySlug } from '../../lib/api';

export default async function handler(req, res) {
  try {
    if (!req.query.slug) {
      return res.status(400).json({ message: 'slug is required' });
    }

    const product = await getProductBySlug(req.query.slug);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error loading product' });
  }
}
