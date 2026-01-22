import { useMemo } from 'react';
import additionalInfoImageMapping from '../data/additionalInfoImageMapping.json';

export const useProductsWithAdditionalInfo = (productsData) => {
  // 이미지 경로에서 키 추출 함수
  const getImageKey = (imagePath) => {
    const fileMatch = imagePath?.match(/fashion\/([^/]+)\.jpg/);
    if (fileMatch) {
      return `fashion-${fileMatch[1]}`;
    }
    return 'default';
  };

  // 제품 데이터에 additionalInfoImage 자동 주입
  const products = useMemo(() => {
    return productsData.map(product => {
      const firstImage = product.image?.[0];
      if (firstImage) {
        const key = getImageKey(firstImage);
        return {
          ...product,
          additionalInfoImage: additionalInfoImageMapping[key] || additionalInfoImageMapping.default
        };
      }
      return {
        ...product,
        additionalInfoImage: additionalInfoImageMapping.default
      };
    });
  }, [productsData]);

  return products;
};
