import { Fragment, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getDiscountPrice } from '../../helpers/product';
import SEO from '../../components/seo';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import { ShopGlobalCommonContext } from '../../App';

const Wishlist = () => {
  let { pathname } = useLocation();

  /* ===============================
     App Context에서 필요한 것만 사용
     =============================== */
  const {
    cartItems,
    currency,
    wishlistItems,
    addToCartHandler,
    deleteFromWishlistHandler,
    deleteAllFromWishlistHandler,
  } = useContext(ShopGlobalCommonContext);

  return (
    <Fragment>
      <SEO titleTemplate="Wishlist" description="Wishlist page" />

      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: 'Home', path: process.env.PUBLIC_URL + '/' },
            { label: 'Wishlist', path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems && wishlistItems.length > 0 ? (
              <Fragment>
                <h3 className="cart-page-title">Your wishlist items</h3>

                <div className="table-content table-responsive cart-table-content">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Unit Price</th>
                        <th>Add To Cart</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {wishlistItems.map((item) => {
                        const discountedPrice = getDiscountPrice(item.price, item.discount);

                        const finalPrice = (item.price * currency.currencyRate);

                        const finalDiscountedPrice = discountedPrice
                          ? (discountedPrice * currency.currencyRate)
                          : null;

                        const cartItem = cartItems.find((cart) => cart.id === item.id);

                        return (
                          <tr key={item.id}>
                            {/* 이미지 */}
                            <td className="product-thumbnail">
                              <Link to={`/product/${item.id}`}>
                                <img src={process.env.PUBLIC_URL + item.image[0]} alt="" />
                              </Link>
                            </td>

                            {/* 상품명 */}
                            <td className="product-name text-center">
                              <Link to={`/product/${item.id}`}>{item.name}</Link>
                            </td>

                            {/* 가격 */}
                            <td className="product-price-cart">
                              {finalDiscountedPrice ? (
                                <>
                                  <span className="amount old">
                                    {currency.currencySymbol + finalPrice}
                                  </span>
                                  <span className="amount">
                                    {currency.currencySymbol + finalDiscountedPrice}
                                  </span>
                                </>
                              ) : (
                                <span className="amount">
                                  {currency.currencySymbol + finalPrice}
                                </span>
                              )}
                            </td>

                            {/* 장바구니 */}
                            <td className="product-wishlist-cart">
                              <button
                                onClick={() => addToCartHandler(item)}
                                disabled={cartItem}
                                className={cartItem ? 'active' : ''}
                              >
                                {cartItem ? 'Added' : 'Add to cart'}
                              </button>
                            </td>

                            {/* 삭제 */}
                            <td className="product-remove">
                              <button onClick={() => deleteFromWishlistHandler(item.id)}>
                                <i className="fa fa-times" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 하단 버튼 */}
                <div className="cart-shiping-update-wrapper">
                  <div className="cart-shiping-update">
                    <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>
                      Continue Shopping
                    </Link>
                  </div>

                  <div className="cart-clear">
                    <button onClick={deleteAllFromWishlistHandler}>Clear Wishlist</button>
                  </div>
                </div>
              </Fragment>
            ) : (
              /* 비어있을 때 */
              <div className="item-empty-area text-center">
                <i className="pe-7s-like" />
                <p>No items found in wishlist</p>
                <Link to="/shop-grid-standard">Add Items</Link>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Wishlist;
