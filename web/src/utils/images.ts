// Imagens estáveis (fixas) sem ORB / CORS
export const productImages = {
  shampooNeutro: '/product-images/shampoo-ph-neutro.jpg',
  shampooConcentrado: '/product-images/shampoo-concentrado.jpg',
  ceraCarnauba: '/product-images/cera-carnauba.jpg',
  desengraxante: '/product-images/desengraxante.jpg',
  limpaVidros: '/product-images/limpa-vidros.jpg',
  rodoMultiuso: '/product-images/rodo-multiuso.jpg',
  panoMicrofibra: '/product-images/pano-microfibra.jpg',
  default: '/product-images/default.jpg',
} as const;

// Função segura de match + fallback local
export function getProductImage(nome: string): string {
  const n = (nome || '').toLowerCase();
  if (n.includes('shampoo') && (n.includes('neutro') || n.includes('ph neutro'))) return productImages.shampooNeutro;
  if (n.includes('shampoo') && n.includes('concentrado')) return productImages.shampooConcentrado;
  if (n.includes('cera') && (n.includes('carna') || n.includes('carná'))) return productImages.ceraCarnauba;
  if (n.includes('desengrax')) return productImages.desengraxante;
  if (n.includes('vidro')) return productImages.limpaVidros;
  if (n.includes('rodo')) return productImages.rodoMultiuso;
  if (n.includes('pano') || n.includes('microfibra')) return productImages.panoMicrofibra;
  return productImages.default;
}


