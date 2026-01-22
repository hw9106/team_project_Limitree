import { Fragment, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SEO from '../../components/seo';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import RelatedProductSlider from '../../wrappers/product/RelatedProductSlider';
import ProductDescriptionTab from '../../wrappers/product/ProductDescriptionTab';
import ProductImageDescription from '../../wrappers/product/ProductImageDescription';

// ✅ Redux 제거 → Context 사용
import { ShopGlobalCommonContext } from '../../App';

const ProductFixedImage = () => {
  let { pathname } = useLocation();
  let { id } = useParams();

  // ✅ 기존 Redux → Context products 사용
  const { products } = useContext(ShopGlobalCommonContext);

  // ⚠️ id 타입 주의 (보통 params는 string)
  const product = products.find((product) => String(product.id) === id);

  if (!product) return null;

  return (
    <Fragment>
      <SEO
        titleTemplate="Product Page"
        description="Product page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: 'Home', path: process.env.PUBLIC_URL + '/' },
            { label: 'Shop Product', path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
          galleryType="fixedImage"
        />

        {/* product description tab */}
        <ProductDescriptionTab spaceBottomClass="pb-90" productFullDesc={product.fullDescription}product={product} />

        {/* related product slider */}
        <RelatedProductSlider spaceBottomClass="pb-95" category={product.category[0]}   />
      </LayoutOne>
    </Fragment>
  );
};

export default ProductFixedImage;
