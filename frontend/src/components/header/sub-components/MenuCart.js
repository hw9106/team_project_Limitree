import { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getDiscountPrice } from '../../../helpers/product';
import { ShopGlobalCommonContext } from '../../../App';

const MenuCart = () => {
  const { cartItems, currency, deleteFromCartHandler } =
    useContext(ShopGlobalCommonContext);

  let cartTotalPrice = 0;

  return (
    <div className="shopping-cart-content">
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <ul>
            {cartItems.map((item) => {
              const discountedPrice = getDiscountPrice(
                item.price,
                item.discount
              );

              const finalProductPrice = (
                item.price * currency.currencyRate
              );

              const finalDiscountedPrice = discountedPrice
                ? (discountedPrice * currency.currencyRate)
                : null;

              // ✅ 총 금액 계산
              discountedPrice != null
                ? (cartTotalPrice += finalDiscountedPrice * item.quantity)
                : (cartTotalPrice += finalProductPrice * item.quantity);

              // ✅ FIX 1: key에서 undefined 방지 (중복 key 에러 근본 해결)
              const colorKey = item.selectedColor ?? 'NO_COLOR';
              const sizeKey = item.selectedSize ?? 'NO_SIZE';

              return (
                <li
                  className="single-shopping-cart"
                  // ✅ FIX 2: 옵션 없을 때도 항상 유니크한 key 보장
                  key={`${item.cartItemId}-${colorKey}-${sizeKey}`}
                >
                  <div className="shopping-cart-img">
                    <Link
                      to={
                        process.env.PUBLIC_URL + '/product/' + item.id
                      }
                    >
                      <img
                        alt=""
                        src={process.env.PUBLIC_URL + item.image[0]}
                        className="img-fluid"
                      />
                    </Link>
                  </div>

                  <div className="shopping-cart-title">
                    <h4>
                      <Link
                        to={
                          process.env.PUBLIC_URL + '/product/' + item.id
                        }
                      >
                        {item.name}
                      </Link>
                    </h4>

                    <h6>Qty: {item.quantity}</h6>

                    <span>
                      {discountedPrice !== null
                        ? currency.currencySymbol +
                          finalDiscountedPrice
                        : currency.currencySymbol +
                          finalProductPrice}
                    </span>

                    {/* ✅ 옵션 있는 경우만 표시 */}
                    {item.selectedColor && item.selectedSize && (
                      <div className="cart-item-variation">
                        <span>Color: {item.selectedColor}</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>
                    )}
                  </div>

                  <div className="shopping-cart-delete">
                    <button
                      onClick={() =>
                        deleteFromCartHandler(item.cartItemId)
                      }
                    >
                      <i className="fa fa-times-circle" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="shopping-cart-total">
            <h4>
              Total :{' '}
              <span className="shop-total">
                {currency.currencySymbol +
                  cartTotalPrice}
              </span>
            </h4>
          </div>

          <div className="shopping-cart-btn btn-hover text-center">
            <Link
              className="default-btn"
              to={process.env.PUBLIC_URL + '/cart'}
            >
              view cart
            </Link>
            <Link
              className="default-btn"
              to={process.env.PUBLIC_URL + '/checkout'}
            >
              checkout
            </Link>
          </div>
        </Fragment>
      ) : (
        <p className="text-center">No items added to cart</p>
      )}
    </div>
  );
};

export default MenuCart;