import { Fragment, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SEO from '../../components/seo';
import { getDiscountPrice } from '../../helpers/product';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import { ShopGlobalCommonContext } from '../../App';

const Cart = () => {
  const { t } = useTranslation();
  let cartTotalPrice = 0;
  let { pathname } = useLocation();

  const {
    cartItems,
    currency,
    addToCartHandler,
    decreaseCartHandler,
    deleteFromCartHandler,
    deleteAllFromCartHandler,
  } = useContext(ShopGlobalCommonContext);

  return (
    <Fragment>
      <SEO titleTemplate={t('cart.title')} description={t('cart.description')} />

      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: t('breadcrumb.home'), path: process.env.PUBLIC_URL + '/' },
            { label: t('breadcrumb.cart'), path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">{t('cart.your_items')}</h3>

                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>{t('cart.table.image')}</th>
                            <th>{t('cart.table.product_name')}</th>
                            <th>{t('cart.table.unit_price')}</th>
                            <th>{t('cart.table.qty')}</th>
                            <th>{t('cart.table.subtotal')}</th>
                            <th>{t('cart.table.action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem) => {
                            const discountedPrice = getDiscountPrice(
                              cartItem.price,
                              cartItem.discount
                            );

                            const finalProductPrice = (
                              cartItem.price * currency.currencyRate
                            );

                            const finalDiscountedPrice = discountedPrice
                              ? (discountedPrice * currency.currencyRate)
                              : null;

                            discountedPrice
                              ? (cartTotalPrice += finalDiscountedPrice * cartItem.quantity)
                              : (cartTotalPrice += finalProductPrice * cartItem.quantity);

                            return (
                              <tr key={cartItem.cartItemId}>
                                <td className="product-thumbnail">
                                  <Link to={process.env.PUBLIC_URL + '/product/' + cartItem.id}>
                                    <img
                                      className="img-fluid"
                                      src={process.env.PUBLIC_URL + cartItem.image[0]}
                                      alt={cartItem.name}
                                    />
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link to={process.env.PUBLIC_URL + '/product/' + cartItem.id}>
                                    {cartItem.name}
                                  </Link>

                                  {cartItem.selectedProductColor &&
                                    cartItem.selectedProductSize && (
                                      <div className="cart-item-variation">
                                        <span>
                                          {t('cart.color')}: {cartItem.selectedProductColor}
                                        </span>
                                        <span>
                                          {t('cart.size')}: {cartItem.selectedProductSize}
                                        </span>
                                      </div>
                                    )}
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {currency.currencySymbol + finalProductPrice}
                                      </span>
                                      <span className="amount">
                                        {currency.currencySymbol + finalDiscountedPrice}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {currency.currencySymbol + finalProductPrice}
                                    </span>
                                  )}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      onClick={() => decreaseCartHandler(cartItem.cartItemId)}
                                    >
                                      -
                                    </button>
                                    <input
                                      className="cart-plus-minus-box"
                                      type="text"
                                      value={cartItem.quantity}
                                      readOnly
                                    />
                                    <button
                                      className="inc qtybutton"
                                       onClick={() => addToCartHandler({ ...cartItem, quantity: 1 })}
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>

                                <td className="product-subtotal">
                                  {discountedPrice
                                    ? currency.currencySymbol +
                                      (finalDiscountedPrice * cartItem.quantity)
                                    : currency.currencySymbol +
                                      (finalProductPrice * cartItem.quantity)}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() => deleteFromCartHandler(cartItem.cartItemId)}
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>
                          {t('cart.continue_shopping')}
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={deleteAllFromCartHandler}>{t('cart.clear_cart')}</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 하단 1컬럼 */}
                <div className="row">
                  <div className="col-lg-6 col-md-12">

                  </div>
                  
                  <div className="col-lg-6 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          {t('cart.total')}
                        </h4>
                      </div>
                      <h5>
                        {t('cart.total_products')}{' '}
                        <span>{currency.currencySymbol + cartTotalPrice}</span>
                      </h5>
                      <h4 className="grand-totall-title">
                        {t('cart.grand_total')}{' '}
                        <span>{currency.currencySymbol + cartTotalPrice}</span>
                      </h4>
                      <Link to={process.env.PUBLIC_URL + '/checkout'}>{t('cart.checkout')}</Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {t('cart.empty')}
                      <br />
                      <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>
                        {t('cart.shop_now')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
