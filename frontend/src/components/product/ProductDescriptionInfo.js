import PropTypes from 'prop-types';
import React, { Fragment, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getProductCartQuantity } from '../../helpers/product';
import Rating from './sub-components/ProductRating';
import { ShopGlobalCommonContext } from '../../App'; // 1️⃣ Redux 대신 Context 사용

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
}) => {
  // 2️⃣ Context에서 상태와 핸들러 가져오기
  const {
    cartItems,
    wishlistItems,
    compareItems,
    addToCartHandler,
    addToWishlistHandler,
    addToCompareHandler,
  } = useContext(ShopGlobalCommonContext);

const hasVariation = Array.isArray(product?.variation) && product.variation.length > 0;
const firstVar = hasVariation ? product.variation[0] : null;
const hasSize = Array.isArray(firstVar?.size) && firstVar.size.length > 0;
const firstSize = hasSize ? firstVar.size[0] : null;

const [selectedProductColor, setSelectedProductColor] = useState(firstVar?.color ?? ''); // ?? ->만약 설정값 없을시 자동 기본값 설정해줌으로써 오류 발생 x 
const [selectedProductSize, setSelectedProductSize] = useState(firstSize?.name ?? '');
const [productStock, setProductStock] = useState(firstSize?.stock ?? product?.stock ?? 0);
  const [quantityCount, setQuantityCount] = useState(1);

  // 3️⃣ 현재 제품의 장바구니 수량 계산
  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  // 4️⃣ wishlist, compare 상태 조회
  const wishlistItem = wishlistItems.find((item) => item.id === product.id);
  const compareItem = compareItems.find((item) => item.id === product.id);

  return (
    <div className="product-details-content ml-70">
      <h2>{product.name}</h2>
      <div className="product-details-price">
        {discountedPrice !== null ? (
          <Fragment>
            <span>{currency.currencySymbol + finalDiscountedPrice}</span>{' '}
            <span className="old">{currency.currencySymbol + finalProductPrice}</span>
          </Fragment>
        ) : (
          <span>{currency.currencySymbol + finalProductPrice} </span>
        )}
      </div>

      {product.rating && product.rating > 0 && (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      )}

      <div className="pro-details-list">
        <p>{product.shortDescription}</p>
      </div>

      {product.variation && (
        <div className="pro-details-size-color">
          {/* 색상 선택 */}
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => (
                <label className={`pro-details-color-content--single ${single.color}`} key={key}>
                  <input
                    type="radio"
                    value={single.color}
                    name="product-color"
                    checked={single.color === selectedProductColor}
                    onChange={() => {
                      setSelectedProductColor(single.color);
                      setSelectedProductSize(single.size[0].name);
                      setProductStock(single.size[0].stock);
                      setQuantityCount(1);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>

          {/* 사이즈 선택 */}
          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variation
                .filter((single) => single.color === selectedProductColor)
                .map((single) =>
                  single.size.map((singleSize, key) => (
                    <label className="pro-details-size-content--single" key={key}>
                      <input
                        type="radio"
                        value={singleSize.name}
                        checked={singleSize.name === selectedProductSize}
                        onChange={() => {
                          setSelectedProductSize(singleSize.name);
                          setProductStock(singleSize.stock);
                          setQuantityCount(1);
                        }}
                      />
                      <span className="size-name">{singleSize.name}</span>
                    </label>
                  ))
                )}
            </div>
          </div>
        </div>
      )}

      {/* 구매 버튼 */}
      {product.affiliateLink ? (
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover ml-0">
            <a href={product.affiliateLink} rel="noopener noreferrer" target="_blank">
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <div className="pro-details-quality">
          <div className="cart-plus-minus">
            <button
              onClick={() => setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)}
              className="dec qtybutton"
            >
              -
            </button>
            <input className="cart-plus-minus-box" type="text" value={quantityCount} readOnly />
            <button
              onClick={() =>
                setQuantityCount(
                  quantityCount < productStock - productCartQty ? quantityCount + 1 : quantityCount
                )
              }
              className="inc qtybutton"
            >
              +
            </button>
          </div>

          {/* 5️⃣ 장바구니 버튼 - Context 핸들러 사용 */}
          <div className="pro-details-cart btn-hover">
            {productStock && productStock > 0 ? (
              <button
                onClick={() =>
                  addToCartHandler({
                    ...product,
                    quantity: quantityCount,
                    selectedProductColor: selectedProductColor,
                    selectedProductSize: selectedProductSize,
                  })
                }
                disabled={productCartQty >= productStock}
              >
                Add To Cart
              </button>
            ) : (
              <button disabled>Out of Stock</button>
            )}
          </div>

          {/* 6️⃣ 위시리스트 버튼 - Context 핸들러 사용 */}
          <div className="pro-details-wishlist">
            <button
              className={wishlistItem ? 'active' : ''}
              disabled={!!wishlistItem}
              title={wishlistItem ? 'Added to wishlist' : 'Add to wishlist'}
              onClick={() => addToWishlistHandler(product)}
            >
              <i className="pe-7s-like" />
            </button>
          </div>

          {/* 7️⃣ 비교 버튼 - Context 핸들러 사용 */}
          <div className="pro-details-compare">
            <button
              className={compareItem ? 'active' : ''}
              disabled={!!compareItem}
              title={compareItem ? 'Added to compare' : 'Add to compare'}
              onClick={() => addToCompareHandler(product)}
            >
              <i className="pe-7s-shuffle" />
            </button>
          </div>
        </div>
      )}

      {/* 카테고리 및 태그 */}
      {product.category && (
        <div className="pro-details-meta">
          <span>Categories :</span>
          <ul>
            {product.category.map((single, key) => (
              <li key={key}>
                <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>{single}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.tag && (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tag.map((single, key) => (
              <li key={key}>
                <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>{single}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 소셜 공유 */}
      <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  product: PropTypes.object.isRequired,
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  currency: PropTypes.shape({}),
};

export default ProductDescriptionInfo;
