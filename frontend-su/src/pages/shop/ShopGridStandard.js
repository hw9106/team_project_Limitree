import { Fragment, useState, useEffect, useContext } from "react";
import Paginator from "react-hooks-paginator";
import { useLocation } from "react-router-dom";
import { getSortedProducts } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import { ShopGlobalCommonContext } from "../../App";

const ShopGridStandard = () => {
  const [layout, setLayout] = useState("grid three-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const { products } = useContext(ShopGlobalCommonContext);

  const pageLimit = 15;
  let { pathname, search } = useLocation(); // ✅ (추가) search(querystring) 사용

  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };

  // ==========================================
  // ✅ (추가) URL Query로 들어온 카테고리를 자동 적용
  // - 예) /shop-grid-standard?cat=침대
  // - 예) /shop-grid-standard?category=침대
  //
  // ⚠️ sortValue는 getSortedProducts가 제품에서 비교하는
  //    "카테고리 문자열"과 동일해야 필터가 걸림
  // ==========================================
  useEffect(() => {
    const params = new URLSearchParams(search);

    // cat 또는 category 둘 중 하나로 받을 수 있게 처리
    const catFromQuery = params.get("cat") || params.get("category") || "";

    // query에 카테고리가 있으면 자동으로 필터 적용
    if (catFromQuery) {
      // ✅ 여기 sortType은 네 getSortedProducts 구현에서
      //    카테고리 필터로 쓰는 키에 맞춰야 함.
      //    (기존 ShopCategories에서 getSortParams("category", category) 쓰는 걸 기준으로 "category" 유지)
      getSortParams("category", catFromQuery);

      // ✅ 카테고리 바뀌면 페이지/오프셋도 초기화 (UX)
      setCurrentPage(1);
      setOffset(0);
    }
  }, [search]); // ✅ URL query가 바뀌면 다시 적용

  useEffect(() => {
    let sortedProducts = getSortedProducts(products, sortType, sortValue);
    const filterSortedProducts = getSortedProducts(
      sortedProducts,
      filterSortType,
      filterSortValue,
    );
    sortedProducts = filterSortedProducts;
    setSortedProducts(sortedProducts);
    setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
  }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

  return (
    <Fragment>
      <SEO
        titleTemplate="Shop Page"
        description="Shop page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Shop", path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                {/* shop sidebar */}
                <ShopSidebar
                  products={products}
                  getSortParams={getSortParams}
                  sideSpaceClass="mr-30"
                  // ✅ (추가) 현재 선택된 카테고리 값을 사이드바로 전달
                  selectedCategory={sortType === "category" ? sortValue : ""}
                />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                {/* shop topbar default */}
                <ShopTopbar
                  getLayout={getLayout}
                  getFilterSortParams={getFilterSortParams}
                  productCount={products.length}
                  sortedProductCount={currentData.length}
                />

                {/* shop page content default */}
                <ShopProducts layout={layout} products={currentData} />

                {/* shop product pagination */}
                <div className="pro-pagination-style text-center mt-30">
                  <Paginator
                    totalRecords={sortedProducts.length}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    setOffset={setOffset}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ShopGridStandard;
