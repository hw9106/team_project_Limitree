import PropTypes from "prop-types";
import React, { Fragment, useContext } from "react";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";
import { ShopGlobalCommonContext } from "../../App"; // Redux 대신 context import




const ProductGridList = ({
  products,
  spaceBottomClass
}) => {
   const { currency,cartItems,  wishlistItems, compareItems } = useContext(ShopGlobalCommonContext);
  
  
  return (
    <Fragment>
      {products?.map(product => {
        return (
          <div className="col-xl-4 col-sm-6" key={product.id}>
            <ProductGridListSingle
              spaceBottomClass={spaceBottomClass}
              product={product}
              currency={currency}
              cartItem={
                cartItems.find(cartItem => cartItem.id === product.id)
              }
              wishlistItem={
                wishlistItems.find(
                  wishlistItem => wishlistItem.id === product.id
                )
              }
              compareItem={
                compareItems.find(
                  compareItem => compareItem.id === product.id
                )
              }
            />
          </div>
        );
      })}
    </Fragment>
  );
};

ProductGridList.propTypes = {
  products: PropTypes.array,
  spaceBottomClass: PropTypes.string,
};

export default ProductGridList;
