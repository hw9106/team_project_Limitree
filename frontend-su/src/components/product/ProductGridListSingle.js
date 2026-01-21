import PropTypes from 'prop-types';
import { Fragment, useState, useContext } from 'react'; // 기존 useDispatch 제거하고 useContext 추가
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getDiscountPrice } from '../../helpers/product';
import Rating from './sub-components/ProductRating';
import ProductModal from './ProductModal';
import { ShopGlobalCommonContext } from '../../App'; // Redux 대신 context import

const ProductGridListSingle = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass,
}) => {
  const [modalShow, setModalShow] = useState(false);

  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(discountedPrice * currency.currencyRate).toFixed(2);

  // Redux 사용 대신 context에서 상태와 setter 가져오기
  const { addToCartHandler, addToWishlistHandler, addToCompareHandler } =
    useContext(ShopGlobalCommonContext);

  return (
    <Fragment>
      <div className={clsx('product-wrap', spaceBottomClass)}>
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + '/product/' + product.id}>
            <img className="default-img" src={process.env.PUBLIC_URL + product.image[0]} alt="" />
            {product.image.length > 1 && (
              <img className="hover-img" src={process.env.PUBLIC_URL + product.image[1]} alt="" />
            )}
          </Link>

          {(product.discount || product.isNew) && (
            <div className="product-img-badges">
              {product.discount && <span className="pink">-{product.discount}%</span>}
              {product.isNew && <span className="purple">New</span>}
            </div>
          )}

          <div className="product-action">
            {/* --------------------- */}
            {/* 기존: dispatch(addToWishlist(product)) */}
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem ? 'active' : ''}
                disabled={wishlistItem}
                title={wishlistItem ? 'Added to wishlist' : 'Add to wishlist'}
                onClick={() => addToWishlistHandler(product)}
              >
                <i className="pe-7s-like" />
              </button>
            </div>

            {/* --------------------- */}
            {/* 기존: dispatch(addToCart(product)) */}
            <div className="pro-same-action pro-cart">
              {product.affiliateLink ? (
                <a href={product.affiliateLink} rel="noopener noreferrer" target="_blank">
                  Buy now
                </a>
              ) : product.variation && product.variation.length > 0 ? (
                <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>Select Option</Link>
              ) : product.stock && product.stock > 0 ? (
                <button
                  onClick={() => addToCartHandler(product)}
                  className={cartItem && cartItem.quantity > 0 ? 'active' : ''}
                  disabled={cartItem && cartItem.quantity > 0}
                  title={cartItem ? 'Added to cart' : 'Add to cart'}
                >
                  <i className="pe-7s-cart"></i>{' '}
                  {cartItem && cartItem.quantity > 0 ? 'Added' : 'Add to cart'}
                </button>
              ) : (
                <button disabled className="active">
                  Out of Stock
                </button>
              )}
            </div>

            {/* --------------------- */}
            {/* 기존: dispatch(addToCompare(product)) */}
            <div className="pro-same-action pro-compare">
              <button
                className={compareItem ? 'active' : ''}
                disabled={compareItem}
                title={compareItem ? 'Added to compare' : 'Add to compare'}
                onClick={() => addToCompareHandler(product)}
              >
                <i className="pe-7s-shuffle" />
              </button>
            </div>

            {/* <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="pe-7s-look" />
              </button>
            </div> */}
          </div>
        </div>

        <div className="product-content text-center">
          <h3>
            <Link to={process.env.PUBLIC_URL + '/product/' + product.id}>{product.name}</Link>
          </h3>
          {product.rating > 0 && (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
            </div>
          )}
          <div className="product-price">
            {discountedPrice !== null ? (
              <Fragment>
                <span>{currency.currencySymbol + finalDiscountedPrice}</span>
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

ProductGridListSingle.propTypes = {
  cartItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.shape({}),
};

export default ProductGridListSingle;
