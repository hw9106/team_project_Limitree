import PropTypes from "prop-types";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useReview } from "../../hooks/useReview";
import { useUserContext } from "../../context/UserContext";

const ProductDescriptionTab = ({
  spaceBottomClass,
  productFullDesc,
  product,
}) => {
  const {
    reviews: productReviews,
    reviewCount,
    loading,
    rating,
    content,
    handleClickStar,
    handleChangeContent,
    handleSubmitReview,
  } = useReview(product);
  const { loginUser } = useUserContext();
  console.log("제품 확인",product);

  return (
    <div className={clsx("description-review-area", spaceBottomClass)}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  Additional Information
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">
                  Reviews ({reviewCount})
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        (product?.image[1] ||
                          "/assets/img/product/fashion/1.jpg")
                      }
                      alt="Additional Information"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="productDescription">
                {productFullDesc}
              </Tab.Pane>

              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  {/* 왼쪽: 리뷰 리스트 */}
                  <div className="col-lg-7">
                    <div className="review-wrapper">
                      {loading && <p>로딩중...</p>}

                      {!loading && productReviews.length === 0 && (
                        <p>등록된 리뷰가 없습니다.</p>
                      )}

                      {productReviews.map((review) => (
                        <div className="single-review" key={review.reviewId}>
                          <div className="review-img">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/img/testimonial/1.jpg"
                              }
                              alt={review.userName}
                            />
                          </div>

                          <div className="review-content">
                            <div className="review-top-wrap">
                              <div className="review-left">
                                <div className="review-name">
                                  <h6>{review.username || review.userName}</h6>
                                </div>

                                <div className="review-rating">
                                  {[...Array(5)].map((_, i) => (
                                    <i
                                      key={i}
                                      className={`fa fa-star${
                                        i < review.rating ? "" : "-o"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              
                            </div>

                            <div className="review-bottom">
                              <p>{review.content}</p>
                              <small>{review.createdAt}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 오른쪽: 리뷰 작성 폼 (Flone 원본 구조로) */}
                  <div className="col-lg-5">
                    <div className="ratting-form-wrapper pl-50">
                      <h3>Add a Review</h3>

                      <div className="ratting-form">
                        <form onSubmit={handleSubmitReview}>
                          <div className="star-box">
                            <span>Your rating:</span>
                            <div className="ratting-star">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`fa fa-star${
                                    star <= rating ? "" : "-o"
                                  }`}
                                  onClick={() => handleClickStar(star)}
                                  style={{ cursor: "pointer" }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* ✅ Flone 원본 폼은 grid + rating-form-style 구조 */}
                          <div className="row">
                            {/* Name/Email을 실제로 안 쓰더라도 input은 UI용으로 두면 원본처럼 보임 */}
                            <div className="col-md-6">
                              <div className="rating-form-style mb-10">
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={loginUser?.name || ""}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="rating-form-style mb-10">
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={loginUser?.email || ""}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="rating-form-style mb-10">
                                <textarea
                                  placeholder="Message"
                                  value={content}
                                  onChange={handleChangeContent}
                                />
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="rating-form-style form-submit">
                                <input type="submit" value="Submit" />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string,
};

export default ProductDescriptionTab;
