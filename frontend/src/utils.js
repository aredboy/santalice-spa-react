// ============================================================
// utils.js — Funciones utilitarias compartidas
// ============================================================
// Antes estaban duplicadas en ShoppingPage, Product, etc.
// Ahora viven acá y se importan donde se necesiten.
// ============================================================

import siteConfig from "./siteConfig";

/**
 * Convierte un string a Sentence Case, usando categoryLabels de siteConfig
 * para nombres especiales (ej: "masdulces" → "Más Dulces").
 */
export const sentenceCase = (s) => {
  if (!s) return '';
  const label = siteConfig.categoryLabels[s.toLowerCase()];
  if (label) return label;
  const normalized = s.replace(/[-_]+/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
};

/**
 * Convierte una categoría en un slug para URLs.
 * "Más Dulces" → "más-dulces"
 */
export const formatSlug = (cat) =>
  cat ? encodeURIComponent(String(cat).toLowerCase().trim().replace(/\s+/g, '-')) : '';

/**
 * Extrae la primera imagen de un producto (que puede ser string o array).
 */
export const getProductImage = (product) => {
  if (!product?.image) return siteConfig.images.placeholder;
  return Array.isArray(product.image)
    ? (product.image[0] || siteConfig.images.placeholder)
    : product.image;
};

/**
 * Genera la URL de WhatsApp con un mensaje.
 */
export const buildWhatsappUrl = (message = '') =>
  `https://wa.me/${siteConfig.whatsapp.number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
