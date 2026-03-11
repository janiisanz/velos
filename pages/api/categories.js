// categories.js: devuelve categorías de WooCommerce para navegación del frontend.
import { getCategories } from '../../lib/api';

export default async function handler(req, res) {
  try {
    const categories = await getCategories();
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error loading categories' });
  }
}
