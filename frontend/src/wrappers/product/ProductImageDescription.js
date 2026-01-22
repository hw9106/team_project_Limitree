import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useContext } from 'react';
import { getDiscountPrice } from '../../helpers/product';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductDescriptionInfo from '../../components/product/ProductDescriptionInfo';
import ProductImageGallerySideThumb from '../../components/product/ProductImageGallerySideThumb';
import ProductImageFixed from '../../components/product/ProductImageFixed';
import { ShopGlobalCommonContext } from '../../App';

const ProductImageDescription = ({ spaceTopClass, spaceBottomClass, galleryType, product }) => {
  const {
    currency,
    cartItems,
    wishlistItems,
    compareItems,
    addToCartHandler,
    addToWishlistHandler,
    addToCompareHandler,
  } = useContext(ShopGlobalCommonContext); // 1️⃣ Redux 제거

  // 2️⃣ 상태 조회
  const cartItem = cartItems.find(
    (item) =>
      item.id === product.id &&
      item.selectedProductColor === product.selectedProductColor &&
      item.selectedProductSize === product.selectedProductSize
  );
  const wishlistItem = wishlistItems.find((item) => item.id === product.id);
  const compareItem = compareItems.find((item) => item.id === product.id);

  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(discountedPrice * currency.currencyRate).toFixed(2);

  return (
    <div className={clsx('shop-area', spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            {galleryType === 'leftThumb' ? (
              <ProductImageGallerySideThumb product={product} thumbPosition="left" />
            ) : galleryType === 'rightThumb' ? (
              <ProductImageGallerySideThumb product={product} />
            ) : galleryType === 'fixedImage' ? (
              <ProductImageFixed product={product} />
            ) : (
              <ProductImageGallery product={product} />
            )}
          </div>
          <div className="col-lg-6 col-md-6">
            <ProductDescriptionInfo
              product={product}
              discountedPrice={discountedPrice}
              currency={currency}
              finalDiscountedPrice={finalDiscountedPrice}
              finalProductPrice={finalProductPrice}
              cartItems={cartItems}
              wishlistItem={wishlistItem}
              compareItem={compareItem}
              addToCartHandler={addToCartHandler}
              addToWishlistHandler={addToWishlistHandler}
              addToCompareHandler={addToCompareHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ProductImageDescription.propTypes = {
  galleryType: PropTypes.string,
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default ProductImageDescription;
