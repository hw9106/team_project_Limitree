import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>{t("nav.home")}</Link>
          <ul className="sub-menu">
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/"}>
                {t("home.groupOne")}
              </Link>
              <ul className="sub-menu">
                <li><Link to="/home-fashion">{t("home.fashion")}</Link></li>
                <li><Link to="/home-fashion-two">{t("home.fashionTwo")}</Link></li>
                <li><Link to="/home-fashion-three">{t("home.fashionThree")}</Link></li>
                <li><Link to="/home-fashion-four">{t("home.fashionFour")}</Link></li>
                <li><Link to="/home-fashion-five">{t("home.fashionFive")}</Link></li>
                <li><Link to="/home-fashion-six">{t("home.fashionSix")}</Link></li>
                <li><Link to="/home-fashion-seven">{t("home.fashionSeven")}</Link></li>
                <li><Link to="/home-fashion-eight">{t("home.fashionEight")}</Link></li>
                <li><Link to="/home-kids-fashion">{t("home.kidsFashion")}</Link></li>
                <li><Link to="/home-cosmetics">{t("home.cosmetics")}</Link></li>
                <li><Link to="/home-furniture">{t("home.furniture")}</Link></li>
                <li><Link to="/home-furniture-two">{t("home.furnitureTwo")}</Link></li>
                <li><Link to="/home-furniture-three">{t("home.furnitureThree")}</Link></li>
                <li><Link to="/home-furniture-four">{t("home.furnitureFour")}</Link></li>
              </ul>
            </li>

            <li className="menu-item-has-children">
              <Link to="/">{t("home.groupTwo")}</Link>
              <ul className="sub-menu">
                <li><Link to="/home-furniture-five">{t("home.furnitureFive")}</Link></li>
                <li><Link to="/home-furniture-six">{t("home.furnitureSix")}</Link></li>
                <li><Link to="/home-furniture-seven">{t("home.furnitureSeven")}</Link></li>
                <li><Link to="/home-electronics">{t("home.electronics")}</Link></li>
                <li><Link to="/home-electronics-two">{t("home.electronicsTwo")}</Link></li>
                <li><Link to="/home-electronics-three">{t("home.electronicsThree")}</Link></li>
                <li><Link to="/home-book-store">{t("home.bookStore")}</Link></li>
                <li><Link to="/home-book-store-two">{t("home.bookStoreTwo")}</Link></li>
                <li><Link to="/home-plants">{t("home.plants")}</Link></li>
                <li><Link to="/home-flower-shop">{t("home.flowerShop")}</Link></li>
                <li><Link to="/home-flower-shop-two">{t("home.flowerShopTwo")}</Link></li>
                <li><Link to="/home-organic-food">{t("home.organicFood")}</Link></li>
                <li><Link to="/home-organic-food-two">{t("home.organicFoodTwo")}</Link></li>
                <li><Link to="/home-onepage-scroll">{t("home.onepageScroll")}</Link></li>
              </ul>
            </li>

            <li className="menu-item-has-children">
              <Link to="/">{t("home.groupThree")}</Link>
              <ul className="sub-menu">
                <li><Link to="/home-grid-banner">{t("home.gridBanner")}</Link></li>
                <li><Link to="/home-auto-parts">{t("home.autoParts")}</Link></li>
                <li><Link to="/home-cake-shop">{t("home.cakeShop")}</Link></li>
                <li><Link to="/home-handmade">{t("home.handmade")}</Link></li>
                <li><Link to="/home-pet-food">{t("home.petFood")}</Link></li>
                <li><Link to="/home-medical-equipment">{t("home.medicalEquipment")}</Link></li>
                <li><Link to="/home-christmas">{t("home.christmas")}</Link></li>
                <li><Link to="/home-black-friday">{t("home.blackFriday")}</Link></li>
                <li><Link to="/home-black-friday-two">{t("home.blackFridayTwo")}</Link></li>
                <li><Link to="/home-valentines-day">{t("home.valentinesDay")}</Link></li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="menu-item-has-children">
          <Link to="/shop-grid-standard">{t("nav.shop")}</Link>
          <ul className="sub-menu">
            <li className="menu-item-has-children">
              <Link to="/shop-grid-standard">{t("shop.layout")}</Link>
              <ul className="sub-menu">
                <li><Link to="/shop-grid-standard">{t("shop.gridStandard")}</Link></li>
                <li><Link to="/shop-grid-filter">{t("shop.gridFilter")}</Link></li>
                <li><Link to="/shop-grid-two-column">{t("shop.gridTwoColumn")}</Link></li>
                <li><Link to="/shop-grid-no-sidebar">{t("shop.gridNoSidebar")}</Link></li>
                <li><Link to="/shop-grid-full-width">{t("shop.gridFullWidth")}</Link></li>
                <li><Link to="/shop-grid-right-sidebar">{t("shop.gridRightSidebar")}</Link></li>
                <li><Link to="/shop-list-standard">{t("shop.listStandard")}</Link></li>
                <li><Link to="/shop-list-full-width">{t("shop.listFullWidth")}</Link></li>
                <li><Link to="/shop-list-two-column">{t("shop.listTwoColumn")}</Link></li>
              </ul>
            </li>

            <li className="menu-item-has-children">
              <Link to="/product/1">{t("product.details")}</Link>
              <ul className="sub-menu">
                <li><Link to="/product/1">{t("product.tabBottom")}</Link></li>
                <li><Link to="/product-tab-left/1">{t("product.tabLeft")}</Link></li>
                <li><Link to="/product-tab-right/1">{t("product.tabRight")}</Link></li>
                <li><Link to="/product-sticky/1">{t("product.sticky")}</Link></li>
                <li><Link to="/product-slider/1">{t("product.slider")}</Link></li>
                <li><Link to="/product-fixed-image/1">{t("product.fixedImage")}</Link></li>
                <li><Link to="/product/1">{t("product.simple")}</Link></li>
                <li><Link to="/product/1">{t("product.variation")}</Link></li>
                <li><Link to="/product/1">{t("product.affiliate")}</Link></li>
              </ul>
            </li>
          </ul>
        </li>

        <li><Link to="/shop-grid-standard">{t("nav.collection")}</Link></li>

        <li className="menu-item-has-children">
          <Link to="/">{t("nav.pages")}</Link>
          <ul className="sub-menu">
            <li><Link to="/cart">{t("nav.cart")}</Link></li>
            <li><Link to="/checkout">{t("nav.checkout")}</Link></li>
            <li><Link to="/wishlist">{t("nav.wishlist")}</Link></li>
            <li><Link to="/compare">{t("nav.compare")}</Link></li>
            <li><Link to="/my-account">{t("nav.myAccount")}</Link></li>
            <li><Link to="/login-register">{t("nav.loginRegister")}</Link></li>
            <li><Link to="/about">{t("nav.aboutUs")}</Link></li>
            <li><Link to="/contact">{t("nav.contact")}</Link></li>
            <li><Link to="/not-found">{t("nav.notFound")}</Link></li>
          </ul>
        </li>

        <li className="menu-item-has-children">
          <Link to="/blog-standard">{t("nav.blog")}</Link>
          <ul className="sub-menu">
            <li><Link to="/blog-standard">{t("nav.blogStandard")}</Link></li>
            <li><Link to="/blog-no-sidebar">{t("nav.blogNoSidebar")}</Link></li>
            <li><Link to="/blog-right-sidebar">{t("nav.blogRightSidebar")}</Link></li>
            <li><Link to="/blog-details-standard">{t("nav.blogDetailsStandard")}</Link></li>
          </ul>
        </li>

        <li>
          <Link to="/contact">{t("nav.contact")}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
