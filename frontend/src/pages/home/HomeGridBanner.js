import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";

const HomeGridBanner = () => {
  const bg = (path) => ({
    backgroundImage: `url(${process.env.PUBLIC_URL}${path})`,
  });
  
  return (
    <Fragment>
      <SEO
        titleTemplate="Grid Banner Home"
        description="Grid banner home of flone react minimalist eCommerce template."
      />
      <LayoutThree
        headerTop="visible"
        headerContainerClass="container-fluid"
        headerBorderStyle="fluid-border"
        headerPaddingClass="header-padding-2"
      >
        {/* grid banner */}
        <div className="product-area hm6-section-padding pb-80">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <div className="product-wrap-4 mb-20">
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                    className="gridBannerLink"
                  >
                    <img
                      className="gridBannerSizer"
                      src={process.env.PUBLIC_URL + "/assets/img/product/hm6-pro-1.jpg"}
                      alt=""
                    />
                    <div
                      className="gridBannerBg"
                      style={bg("/assets/img/main/PH207316.jpg")}
                    />
                  </Link>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="product-wrap-4 mb-20">
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                    className="gridBannerLink"
                  >
                    <div className="gridBannerImgBox gridBanner--sm"></div>

                    <img
                      className="gridBannerSizer"
                      src={process.env.PUBLIC_URL + "/assets/img/product/hm6-pro-3.jpg"}
                      alt=""
                    />
                    <div
                      className="gridBannerBg"
                      style={bg("/assets/img/main/PE975400.jpg")}
                      
                    />
                  </Link>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="product-wrap-4 mb-20">
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                    className="gridBannerLink"
                  >
                    <div className="gridBannerImgBox gridBanner--sm"></div>

                    <img
                      className="gridBannerSizer"
                      src={process.env.PUBLIC_URL + "/assets/img/product/hm6-pro-4.jpg"}
                      alt=""
                    />
                    <div
                      className="gridBannerBg"
                      style={bg("/assets/img/main/PH202760.jpg")}
                    />
                  </Link>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="product-wrap-4 mb-20">
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                    className="gridBannerLink"
                  >
                    <img
                      className="gridBannerSizer"
                      src={process.env.PUBLIC_URL + "/assets/img/product/hm6-pro-2.jpg"}
                      alt=""
                    />
                    <div
                      className="gridBannerBg"
                      style={bg("/assets/img/main/cim.jpg")}
                    />
                  </Link>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="product-wrap-4 mb-20">
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                    className="gridBannerLink"
                  >
                    <img
                      className="gridBannerSizer"
                      src={process.env.PUBLIC_URL + "/assets/img/product/hm6-pro-5.jpg"}
                      alt=""
                    />
                    <div
                      className="gridBannerBg"
                      style={bg("/assets/img/main/PH207861.jpg")}
                    />
                  </Link>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="product-wrap-4 mb-20">
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                    className="gridBannerLink"
                  >
                    <img
                      className="gridBannerSizer"
                      src={process.env.PUBLIC_URL + "/assets/img/product/hm6-pro-6.jpg"}
                      alt=""
                    />
                    <div
                      className="gridBannerBg"
                      style={bg("/assets/img/main/PH199652.jpg")}
                    />
                  </Link>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="product-wrap-4 mb-20">
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                    className="gridBannerLink"
                  >
                    <img
                      className="gridBannerSizer"
                      src={process.env.PUBLIC_URL + "/assets/img/product/hm6-pro-7.jpg"}
                      alt=""
                    />
                    <div
                      className="gridBannerBg"
                      style={bg("/assets/img/main/PH207351.jpg")}
                    />
                  </Link>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="product-wrap-4 mb-20">
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                    className="gridBannerLink"
                  >
                    <img
                      className="gridBannerSizer"
                      src={process.env.PUBLIC_URL + "/assets/img/product/hm6-pro-8.jpg"}
                      alt=""
                    />
                    <div
                      className="gridBannerBg"
                      style={bg("/assets/img/main/PH173293.jpg")}
                    />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* newsletter */}
        
      </LayoutThree>
    </Fragment>
  );
};

export default HomeGridBanner;
