// src/App.js
import { Suspense, createContext, lazy, useState, useEffect } from 'react';
import ScrollToTop from './helpers/scroll-top';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import wishlistData from './data/wishlist.json';
import ordersData from './data/orders.json';

import './i18n';
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { useCompare } from './hooks/useCompare';
import { useOrders } from './hooks/useOrders';
import { useProducts } from './hooks/useProducts';
import { AdminRoute } from './components/ProtectedRoute';
import { autoRefreshToken } from './util/jwtUtil';
import './api/axiosConfig'; // axios interceptor 설정 import
import KakaoCallback from "./pages/other/KakaoCallback.js";

const HomeGridBanner = lazy(() => import('./pages/home/HomeGridBanner'));
const ShopGridStandard = lazy(() => import('./pages/shop/ShopGridStandard'));
const ShopGridFilter = lazy(() => import('./pages/shop/ShopGridFilter'));
const ProductFixedImage = lazy(() => import('./pages/shop-product/ProductFixedImage'));

const BlogStandard = lazy(() => import('./pages/blog/BlogStandard'));
const BlogNoSidebar = lazy(() => import('./pages/blog/BlogNoSidebar'));
const BlogRightSidebar = lazy(() => import('./pages/blog/BlogRightSidebar'));
const BlogDetailsStandard = lazy(() => import('./pages/blog/BlogDetailsStandard'));

const About = lazy(() => import('./pages/other/About'));
const Contact = lazy(() => import('./pages/other/Contact'));
const MyAccount = lazy(() => import('./pages/other/MyAccount'));
const LoginRegister = lazy(() => import('./pages/other/LoginRegister'));
const Cart = lazy(() => import('./pages/other/Cart'));
const Wishlist = lazy(() => import('./pages/other/Wishlist'));
const Compare = lazy(() => import('./pages/other/Compare'));
const Checkout = lazy(() => import('./pages/other/Checkout'));
const NotFound = lazy(() => import('./pages/other/NotFound'));
const OrderComplete = lazy(() => import('./pages/other/OrderComplete'));

const AdminLayout = lazy(() => import('./pages/admin/AdminMenuList'));
const UserListPage = lazy(() => import('./pages/admin/users/UserListPage'));
const UserDetailPage = lazy(() => import('./pages/admin/users/UserDetailPage'));
const AdminOrder = lazy(() => import('./pages/admin/AdminOrder'));
const AdminProduct = lazy(() => import('./pages/admin/product/AdminProduct'));
const AdminProductCreatePage = lazy(() => import('./pages/admin/product/AdminProductCreatePage'));
const AdminProductBulkUploadPage = lazy(() =>
  import('./pages/admin/product/AdminProductBulkUploadPage.js')
);
const AdminProductUpdatePage = lazy(() => import('./pages/admin/product/AdminProductUpdatePage'));
const AdminReviewList = lazy(() => import('./pages/admin/review/AdminReviewList'));

export const ShopGlobalCommonContext = createContext(null);

const App = () => {
  const [currency, setCurrency] = useState({
    currencyName: 'KRW',
    currencySymbol: '₩',
    currencyRate: 1,
    decimal: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { cartItems, addToCart, decreaseCart, deleteFromCart, deleteAllFromCart } = useCart([]);
  const { wishlistItems, addToWishlist, deleteFromWishlist, deleteAllFromWishlist } =
    useWishlist(wishlistData);
  const { compareItems, addToCompare, deleteFromCompare, deleteAllFromCompare } =
    useCompare([]);
  const { orders, setOrders, addOrder, deleteOrder, deleteAllOrders } = useOrders(ordersData);
  const { products,setProducts } = useProducts([]);
  // 토큰 자동 갱신 설정 (30초마다 체크)
  useEffect(() => {
    // 초기 토큰 체크
    autoRefreshToken();

    // 30초마다 토큰 만료 여부 체크 및 자동 갱신(setInterval(자바스크립트 표준 내장함수) : 반복 실행)
    const interval = setInterval(() => { 
      autoRefreshToken();
    }, 30000); // 30초

    return () => clearInterval(interval); // clearInterval : 앱 종료시 setInterval 종료하기 위해 return (반복 중지)
  }, []);

  return (
    <ShopGlobalCommonContext.Provider
      value={{
        products,
        currency,
        cartItems,
        wishlistItems,
        compareItems,
        orders,
    selectedCategory,
    setSelectedCategory,        
        addToCartHandler: addToCart,
        decreaseCartHandler: decreaseCart,
        deleteFromCartHandler: deleteFromCart,
        deleteAllFromCartHandler: deleteAllFromCart,
        addToWishlistHandler: addToWishlist,
        deleteFromWishlistHandler: deleteFromWishlist,
        deleteAllFromWishlistHandler: deleteAllFromWishlist,
        addToCompareHandler: addToCompare,
        deleteFromCompareHandler: deleteFromCompare,
        deleteAllFromCompareHandler: deleteAllFromCompare,
        setOrders,
        setProducts,
        setCurrency,
        addOrder,
        deleteOrder,
        deleteAllOrders,
      }}
    >
      <Router>
        <ScrollToTop>
          <Suspense
            fallback={
              <div className="flone-preloader-wrapper">
                <div className="flone-preloader">
                  <span />
                  <span />
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomeGridBanner />} />
              <Route path="/shop-grid-standard" element={<ShopGridStandard />} />
              <Route path="/shop-grid-filter" element={<ShopGridFilter />} />
              <Route path="/product/:id" element={<ProductFixedImage />} />

              <Route path="/blog-standard" element={<BlogStandard />} />
              <Route path="/blog-no-sidebar" element={<BlogNoSidebar />} />
              <Route path="/blog-right-sidebar" element={<BlogRightSidebar />} />
              <Route path="/blog-details-standard" element={<BlogDetailsStandard />} />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/login-register" element={<LoginRegister />} />
              <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-complete" element={<OrderComplete />} />

              {/*Admin 라우트 보호 */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route path="users" element={<UserListPage />} />
                <Route path="users/:userId" element={<UserDetailPage />} />
                <Route path="product" element={<AdminProduct />} />
                <Route path="order" element={<AdminOrder />} />
                <Route path="product-create" element={<AdminProductCreatePage />} />
                <Route path="product-xe" element={<AdminProductBulkUploadPage />} />
                <Route path="review-list" element={<AdminReviewList />} />
                <Route path="product-update/:id" element={<AdminProductUpdatePage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ScrollToTop>
      </Router>
    </ShopGlobalCommonContext.Provider>
  );
};

export default App;
