import { Fragment, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import Rating from './sub-components/ProductRating';
import { getDiscountPrice } from '../../helpers/product';
import ProductModal from './ProductModal';
import { ShopGlobalCommonContext } from '../../App';

const ProductGridSingle = ({ product, spaceBottomClass }) => {
  const {
    currency,
    cartItems,
    wishlistItems,
    compareItems,
    addToCartHandler,
    addToWishlistHandler,
  } = useContext(ShopGlobalCommonContext);

  const [modalShow, setModalShow] = useState(false);

  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(discountedPrice * currency.currencyRate).toFixed(2);

  const cartItem = cartItems.find(
    (item) =>
      item.id === product.id &&
      item.selectedProductColor === product.selectedProductColor &&
      item.selectedProductSize === product.selectedProductSize
  );

  const wishlistItem = wishlistItems.find((item) => item.id === product.id);
  const compareItem = compareItems.find((item) => item.id === product.id);

  return (
    <Fragment>
      <div className={clsx('product-wrap', spaceBottomClass)}>
        <div className="product-img">
          <Link to={`/product/${product.id}`}>
            <img className="default-img" src={product.image[0]} alt={product.name} />
            {product.image.length > 1 && (
              <img className="hover-img" src={product.image[1]} alt={product.name} />
            )}
          </Link>

          {(product.discount || product.isNew) && (
            <div className="product-img-badges">
              {product.discount && <span className="pink">-{product.discount}%</span>}
              {product.isNew && <span className="purple">New</span>}
            </div>
          )}

          <div className="product-action">
            {/* Wishlist */}
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem ? 'active' : ''}
                disabled={!!wishlistItem}
                title={wishlistItem ? 'Added to wishlist' : 'Add to wishlist'}
                onClick={() => addToWishlistHandler(product)}
              >
                <i className="pe-7s-like" />
              </button>
            </div>

            {/* Cart */}
            <div className="pro-same-action pro-cart">
              {product.affiliateLink ? (
                <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                  Buy now
                </a>
              ) : product.variation?.length > 0 ? (
                <Link to={`/product/${product.id}`}>Select Option</Link>
              ) : product.stock > 0 ? (
                <button
                  className={cartItem ? 'active' : ''}
                  disabled={!!cartItem}
                  title={cartItem ? 'Added to cart' : 'Add to cart'}
                  onClick={() => addToCartHandler(product)}
                >
                  <i className="pe-7s-cart" /> {cartItem ? 'Added' : 'Add to cart'}
                </button>
              ) : (
                <button disabled className="active">
                  Out of Stock
                </button>
              )}
            </div>

            {/* Quick View */}
            <div className="pro-same-action pro-quickview">
              <button title="Quick View" onClick={() => setModalShow(true)}>
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>

        <div className="product-content text-center">
          <h3>
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          {product.rating > 0 && (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
            </div>
          )}

          <div className="product-price">
            {discountedPrice ? (
              <Fragment>
                <span>{currency.currencySymbol + finalDiscountedPrice}</span>{' '}
                <span className="old">{currency.currencySymbol + finalProductPrice}</span>
              </Fragment>
            ) : (
              <span>{currency.currencySymbol + finalProductPrice}</span>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};

ProductGridSingle.propTypes = {
  product: PropTypes.object.isRequired,
  spaceBottomClass: PropTypes.string,
};

export default ProductGridSingle;
