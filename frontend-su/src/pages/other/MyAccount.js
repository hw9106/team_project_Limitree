import { Fragment, useContext, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { ShopGlobalCommonContext } from "../../App";
import { formatPrice } from "../../helpers/price";
import { useUserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import cogoToast from "cogo-toast";

// ✅ 추가: 내 주문 훅
import { useMyOrders } from "../../hooks/useOrders"; // 경로 맞춰

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const MyAccount = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const { currency, deleteOrder } = useContext(ShopGlobalCommonContext);
  const { loginUser, loading, userModifyAtion } = useUserContext();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // ✅ (변경 1) lastOrder를 유저별로 분리 (다른 아이디와 섞이는 문제 해결)
  const STORAGE_KEY = useMemo(
    () => `lastOrder:${loginUser?.userId ?? "guest"}`,
    [loginUser?.userId]
  );

  // ✅ 내 주문만 가져오기 (/orders/my)
  const { orders: myOrders } = useMyOrders(loginUser?.userId);
  console.log("myOrders length=", myOrders?.length, myOrders?.[0]);

  // ✅ (변경 2) orders fallback도 유저별 key로만 읽기
  const ordersToShow = useMemo(() => {
    if (Array.isArray(myOrders) && myOrders.length > 0) return myOrders;

    // 로그인 유저가 없으면 lastOrder fallback도 사용 안 함(원하면 유지 가능)
    if (!loginUser?.userId) return [];

    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? safeJsonParse(saved) : null;

    if (parsed && typeof parsed === "object") return [parsed];
    return [];
  }, [myOrders, STORAGE_KEY, loginUser?.userId]); // ✅ (변경 3) STORAGE_KEY 의존성 추가

  const lastOrder = useMemo(() => {
    if (!Array.isArray(ordersToShow) || ordersToShow.length === 0) return null;

    const sorted = [...ordersToShow].sort((a, b) => {
      const at = new Date(a?.createdAt || a?.orderDate || 0).getTime();
      const bt = new Date(b?.createdAt || b?.orderDate || 0).getTime();
      if (bt !== at) return bt - at;
      return Number(b?.orderId || 0) - Number(a?.orderId || 0);
    });

    return sorted[0] ?? ordersToShow[0] ?? null;
  }, [ordersToShow]);

  const handleModifyAction = async (e) => {
    e.preventDefault();

    if (!loginUser?.userId) {
      cogoToast.error("로그인이 필요합니다", { position: "bottom-left" });
      return;
    }

    const success = await userModifyAtion({
      userId: loginUser?.userId,
      password,
      password2,
    });

    if (success) {
      setPassword("");
      setPassword2("");
      cogoToast.success("비밀번호 초기화");
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate={t("myAccount.seoTitle")}
        description={t("myAccount.seoDescription")}
      />

      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: t("breadcrumb.home"), path: process.env.PUBLIC_URL + "/" },
            {
              label: t("myAccount.breadcrumbTitle"),
              path: process.env.PUBLIC_URL + pathname,
            },
          ]}
        />

        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    {/* ================== 내 정보 ================== */}
                    <Accordion.Item eventKey="0" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> {t("myAccount.section1.title")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>{t("myAccount.section1.heading")}</h4>
                            <h5>{t("myAccount.section1.subHeading")}</h5>
                          </div>

                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>{t("myAccount.section1.firstName")}</label>
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={loginUser?.name || ""}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>{t("myAccount.section1.email")}</label>
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={loginUser?.email || ""}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>{t("myAccount.section1.telephone")}</label>
                                <input type="text" value={lastOrder?.phoneNumber || ""} readOnly />
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>{t("myAccount.section1.address")}</label>
                                <input type="text" value={lastOrder?.shippingAddress || ""} readOnly />
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>{t("myAccount.section1.lastorder")}</label>
                                <input
                                  type="text"
                                  value={
                                    lastOrder?.createdAt
                                      ? new Date(lastOrder.createdAt).toLocaleDateString("ko-KR")
                                      : lastOrder?.orderDate
                                      ? new Date(lastOrder.orderDate).toLocaleDateString("ko-KR")
                                      : ""
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* ================== 비번 변경 ================== */}
                    <Accordion.Item eventKey="1" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>2 .</span> {t("myAccount.section2.title")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>{t("myAccount.section2.heading")}</h4>
                            <h5>{t("myAccount.section2.subHeading")}</h5>
                          </div>

                          <form onSubmit={handleModifyAction}>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>{t("myAccount.section2.password")}</label>
                                <input
                                  type="password"
                                  placeholder={t("auth.password")}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>{t("myAccount.section2.passwordConfirm")}</label>
                                <input
                                  type="password"
                                  placeholder={t("auth.passwordConfirm")}
                                  value={password2}
                                  onChange={(e) => setPassword2(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit" disabled={loading}>
                                  <span>{t("myAccount.section2.title")}</span>
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* ================== 주문 내역 ================== */}
                    <Accordion.Item eventKey="3" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>3 .</span> {t("myAccount.section4.title")}
                      </Accordion.Header>

                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>{t("myAccount.section4.heading")}</h4>
                            <h5>{t("myAccount.section4.subHeading")}</h5>
                          </div>

                          {ordersToShow && ordersToShow.length > 0 ? (
                            <div className="order-list">
                              {ordersToShow.map((order, index) => {
                                const items = order?.cartItems ?? order?.orderItems ?? [];
                                const cur = order?.currency ?? currency;
                                const rate = cur?.currencyRate ?? 1;

                                const orderTotal = items.reduce((total, item) => {
                                  const price = Number(item?.price ?? 0);
                                  const qty = Number(item?.quantity ?? 1);
                                  const finalPrice =
                                    item?.discount != null
                                      ? price * (1 - Number(item.discount) / 100)
                                      : price;

                                  return total + finalPrice * rate * qty;
                                }, 0);

                                const orderIdText =
                                  order?.orderId != null
                                    ? String(order.orderId).substring(0, 8)
                                    : "N/A";

                                const orderDateText = order?.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString("ko-KR")
                                  : order?.orderDate
                                  ? new Date(order.orderDate).toLocaleDateString("ko-KR")
                                  : "N/A";

                                return (
                                  <div key={order?.orderId ?? index} className="single-order mb-30">
                                    <div className="order-header bg-light p-3 mb-2">
                                      <div className="row">
                                        <div className="col-md-4">
                                          <strong>{t("myAccount.section4.orderNumber")}:</strong>{" "}
                                          {orderIdText}
                                        </div>
                                        <div className="col-md-4">
                                          <strong>{t("myAccount.section4.orderDate")}:</strong>{" "}
                                          {orderDateText}
                                        </div>
                                        <div className="col-md-4">
                                          <strong>{t("myAccount.section4.total")}:</strong>{" "}
                                          {formatPrice(orderTotal, cur)}
                                        </div>
                                      </div>
                                    </div>

                                    {items.length > 0 && (
                                      <div className="order-body p-3">
                                        <ul className="list-unstyled mb-0">
                                          {items.map((item) => {
                                            const itemName =
                                              item?.name ??
                                              item?.product?.name ??
                                              `${t("myAccount.section4.product")} #${
                                                item?.productId ?? item?.product?.id ?? ""
                                              }`;

                                            const itemKey =
                                              item?.cartItemId ??
                                              item?.orderItemId ??
                                              item?.productId ??
                                              item?.product?.id ??
                                              `${order?.orderId ?? index}-${itemName}`;

                                            return (
                                              <li
                                                key={itemKey}
                                                className="d-flex justify-content-between mb-1"
                                              >
                                                <span>
                                                  {itemName} × {item?.quantity ?? 1}
                                                </span>
                                                <span>
                                                  {formatPrice(
                                                    Number(item?.price ?? 0) *
                                                      Number(item?.quantity ?? 1) *
                                                      rate,
                                                    cur
                                                  )}
                                                </span>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    )}

                                    <div className="order-actions px-3 pb-3">
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                          if (window.confirm(t("myAccount.section4.cancelConfirm"))) {
                                            deleteOrder(order.orderId);
                                          }
                                        }}
                                      >
                                        {t("myAccount.section4.cancelOrder")}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p>{t("myAccount.section4.empty")}</p>
                            </div>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
