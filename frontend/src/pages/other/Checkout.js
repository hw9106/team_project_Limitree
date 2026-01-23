import { useNavigate } from "react-router-dom";
import { Fragment, useContext, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cogoToast from "cogo-toast";

import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { getDiscountPrice } from "../../helpers/product";
import { ShopGlobalCommonContext } from "../../App";




// ✅ useOrders 훅
import { useOrders } from "../../hooks/useOrders";
// ✅ 로그인 유저
import { useUserContext } from "../../context/UserContext";

const Checkout = () => {
  // 다음 주소 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const detailRef = useRef(null);
  const hasAutofilledRef = useRef(false);

  const handlePostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      cogoToast.error("주소 검색 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
          if (data.bname) extraAddress += data.bname;
          if (data.buildingName) {
            extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
          }
          if (extraAddress) fullAddress += ` (${extraAddress})`;
        }

        setBillingInfo((prev) => ({
          ...prev,
          zip: data.zonecode,
          streetAddress: fullAddress,
        }));

        setTimeout(() => detailRef.current?.focus(), 0);
      },
    }).open();
  };

  const { t } = useTranslation();
  const navigate = useNavigate();
  let cartTotalPrice = 0;
  let { pathname } = useLocation();

  // ✅ cart 관련 context
  const { cartItems, currency, deleteAllFromCartHandler } = useContext(ShopGlobalCommonContext);

  // ✅ 로그인 유저
  const { loginUser } = useUserContext();

  // ✅ 로그인 안됐으면 주문 못하게 (guard1 같은 임시값 쓰면 주문/조회 꼬임)
  const userId = loginUser?.userId;

  // ✅ 유저별 lastOrder key (OrderComplete/MyAccount와 동일 규칙)
  const STORAGE_KEY = useMemo(() => {
    return userId ? `lastOrder:${userId}` : "lastOrder:guest";
  }, [userId]);

  // ✅ orders/addOrder는 훅에서
  const { addOrder, lastBillingInfo } = useOrders(userId);

  // ✅ 폼 상태
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    streetAddress: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    orderNotes: "",
  });

  // ✅ 마지막 배송지 자동 입력
  useEffect(() => {
    if (!lastBillingInfo) return;
    if (hasAutofilledRef.current) return;

    setBillingInfo((prev) => ({
      ...prev,
      ...lastBillingInfo,
    }));

    hasAutofilledRef.current = true;
  }, [lastBillingInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // ✅ 로그인 체크(중요)
    if (!userId) {
      cogoToast.error("로그인이 필요합니다", { position: "bottom-left" });
      return false;
    }

    const requiredFields = [
      { field: "firstName", label: "이름" },
      { field: "streetAddress", label: "주소" },
      { field: "zip", label: "우편번호" },
      { field: "phone", label: "전화번호" },
      { field: "addressLine2", label: "상세주소" },
    ];

    for (let { field, label } of requiredFields) {
      if (!billingInfo[field] || billingInfo[field].trim() === "") {
        cogoToast.error(`${label}을(를) 입력해주세요`, { position: "bottom-left" });
        return false;
      }
    }
    return true;
  };

  // ✅ 주문하기
  const placeOrderHandler = async () => {
    if (!cartItems || cartItems.length === 0) return;
    if (!validateForm()) return;

    const detail = (billingInfo.addressLine2 || "").trim();
    const mergedStreetAddress = detail
      ? `${billingInfo.streetAddress} ${detail}`
      : billingInfo.streetAddress;

    const { addressLine2, ...restBillingInfo } = billingInfo;

    const orderData = {
      cartItems,
      currency,
      billingInfo: {
        ...restBillingInfo,
        streetAddress: mergedStreetAddress,
      },
    };

    console.log("주문 데이터:", orderData);

    const createdOrder = await addOrder(orderData);

    if (createdOrder) {
      // ✅ 1) 첫주문 완료페이지가 뜨게: storage에 저장
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(createdOrder));
      } catch (e) {
        console.warn("lastOrder 저장 실패:", e);
      }

      // ✅ 2) state로도 넘기기(가장 확실)
      await deleteAllFromCartHandler();
      navigate(process.env.PUBLIC_URL + "/order-complete", { state: createdOrder });
      return;
    }

    console.error("주문 생성 실패");
    cogoToast.error("주문 생성 실패", { position: "bottom-left" });
  };

  return (
    <Fragment>
      <SEO titleTemplate={t("checkout.title")} description={t("checkout.description")} />

      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: t("breadcrumb.home"), path: process.env.PUBLIC_URL + "/" },
            { label: t("breadcrumb.checkout"), path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length > 0 ? (
              <div className="row">
                {/* ================= LEFT ================= */}
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>{t("checkout.billing_details")}</h3>

                    <div className="row">
                      <div className="col-lg-12 col-md-6">
                        <div className="billing-info mb-20">
                          <label>{t("checkout.first_name")} *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={billingInfo.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>{t("checkout.zip")} *</label>
                          <input
                            type="text"
                            name="zip"
                            value={billingInfo.zip}
                            readOnly
                            onClick={handlePostcode}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>{t("checkout.street_address")} *</label>
                          <input
                            className="billing-address"
                            placeholder={t("checkout.address_line_1")}
                            type="text"
                            name="streetAddress"
                            value={billingInfo.streetAddress}
                            readOnly
                            onClick={handlePostcode}
                            required
                          />
                          <input
                            ref={detailRef}
                            placeholder={t("checkout.address_line_2")}
                            type="text"
                            name="addressLine2"
                            value={billingInfo.addressLine2}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-6">
                        <div className="billing-info mb-20">
                          <label>{t("checkout.phone")} *</label>
                          <input
                            type="text"
                            name="phone"
                            value={billingInfo.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="additional-info-wrap">
                      <h4>{t("checkout.additional_info")}</h4>
                      <div className="additional-info">
                        <label>{t("checkout.order_notes")}</label>
                        <textarea
                          placeholder={t("checkout.order_notes_placeholder")}
                          name="orderNotes"
                          value={billingInfo.orderNotes}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT ================= */}
                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>{t("checkout.your_order")}</h3>

                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>{t("checkout.product")}</li>
                            <li>{t("checkout.total")}</li>
                          </ul>
                        </div>

                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem) => {
                              const discountedPrice = getDiscountPrice(cartItem.price, cartItem.discount);

                              const finalProductPrice = cartItem.price * currency.currencyRate;
                              const finalDiscountedPrice = discountedPrice
                                ? discountedPrice * currency.currencyRate
                                : null;

                              discountedPrice
                                ? (cartTotalPrice += finalDiscountedPrice * cartItem.quantity)
                                : (cartTotalPrice += finalProductPrice * cartItem.quantity);

                              return (
                                <li key={cartItem.cartItemId}>
                                  <span className="order-middle-left">
                                    {cartItem.name} × {cartItem.quantity}
                                  </span>
                                  <span className="order-price">
                                    {discountedPrice
                                      ? currency.currencySymbol + finalDiscountedPrice * cartItem.quantity
                                      : currency.currencySymbol + finalProductPrice * cartItem.quantity}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">{t("checkout.shipping")}</li>
                            <li>{t("checkout.free_shipping")}</li>
                          </ul>
                        </div>

                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">{t("checkout.total")}</li>
                            <li>{currency.currencySymbol + cartTotalPrice}</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="payment-method" >
                      <div className="place-order mt-25">
                        <button className="btn-hover" type="button" onClick={placeOrderHandler}>
                          {t("checkout.place_order")}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12 text-center">
                  <h3>{t("checkout.empty_cart")}</h3>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                    {t("checkout.shop_now")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Checkout;
