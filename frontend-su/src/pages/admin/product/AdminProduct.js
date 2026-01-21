import {useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import { ShopGlobalCommonContext } from '../../../App';
import  * as productApi from "../../../api/productApi";
import { getSortedProducts } from '../../../helpers/product';
import { useTranslation } from 'react-i18next';




const AdminProduct = () => {
    

  const [sortType] = useState('');
  const [sortValue] = useState('');
  const [filterSortType] = useState('');
  const [filterSortValue] = useState('');
  const [offset] = useState(0);
  const { products,setProducts } = useContext(ShopGlobalCommonContext);


const { t } = useTranslation();
  useEffect(() => {
    let sortedProducts = getSortedProducts(products, sortType, sortValue);
    const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
    sortedProducts = filterSortedProducts;
  }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);
  
  const deleteFromAdminProduct=async (productId)=>{

   const result = await productApi.deleteProductById(productId);

   if (result.status ===1) {
    setProducts(products.filter(p=>p.id !==productId));
   }
  };

  const deleteFromAdminProductAll=async ()=>{

   const test = await productApi.deleteAll();
   console.log("왜 안지워져....", test);
   // 전체 삭제 성공시 상품 목록 다시 불러오기 
   if (test.status ===1) {
    window.location.reload(); // 페이지 새로고침 
   }
  };


  

  return (
    <div>
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {products && products.length >= 1 ? (
              <div>
                <h3 className="cart-page-title">{t('admin.product_list')}</h3>

                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>{t('admin.product_table.id')}</th>
                            <th>{t('admin.product_table.name')}</th>
                            <th>{t('admin.product_table.price')}</th>
                            <th>{t('admin.product_table.discount')}</th>
                            <th>{t('admin.product_table.rating')}</th>
                            <th>{t('admin.product_table.saleCount')}</th>
                            <th>{t('admin.product_table.new')}</th>
                            <th>{t('admin.product_table.sku')}</th>
                            <th>{t('admin.product_table.category')}</th>
                            <th>{t('admin.product_table.rating')}</th>
                            <th>{t('admin.product_table.offerEnd')}</th>
                            <th>{t('admin.delete')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => {
                            return (
                              
                              <tr key={product.id}>
                                <td className="product-thumbnail">
                                  <Link to={process.env.PUBLIC_URL + '/admin/product-update/' + product.id}>
                                    <img
                                      className="img-fluid"
                                      src={process.env.PUBLIC_URL + product.image[0]}
                                      alt={product.name}
                                    />
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link to={process.env.PUBLIC_URL + '/admin/product-update/' + product.id}>
                                    {product.name}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  {product.price}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    {product.discount}
                                  </div>
                                </td>

                                <td className="product-subtotal">
                                  {product.rating}
                                </td>

                                <td className="product-remove">
                                  {product.saleCount}
                                </td>

                                <td className="product-remove">
                                  {product.isNew ? "신상품" : "이월상품"}
                                </td>

                                <td className="product-remove">
                                  {product.sku}
                                </td>

                                <td className="product-remove">
                                  {product.category}
                                </td>

                                <td className="product-remove">
                                  {product.rating}
                                </td>

                                <td className="product-remove">
                                   {product.offerEnd}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() => deleteFromAdminProduct(product.id)}
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
                        <Link to={process.env.PUBLIC_URL + '/admin/product-create'}>
                          {t('admin.product_regist')}
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => deleteFromAdminProductAll()}>{t('admin.product_deleteAll')}</button>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {t('admin.empty')}
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

    </div>
  );
};

export default AdminProduct;
