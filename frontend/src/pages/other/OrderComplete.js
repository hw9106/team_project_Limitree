import { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import { ShopGlobalCommonContext } from "../../App";
import { formatPrice } from "../../helpers/price";
import { useUserContext } from "../../context/UserContext";





const safeJsonParse = (value) => {
  try { return JSON.parse(value); } catch (e) { return null; }
};

// ✅ {status,msg,data} 형태면 data만 꺼내서 주문객체로 정규화
const normalizeOrder = (payload) => {
  if (!payload) return null;
  if (typeof payload === "object" && payload?.data && "status" in payload) return payload.data;
  return payload;
};

const extractItems = (order) => {
  if (!order) return [];
  const candidates = [order.cartItems, order.orderItems, order.items, order.orderItemList, order.products];
  const found = candidates.find((x) => Array.isArray(x));
  return Array.isArray(found) ? found : [];
};

const extractQty = (item) => {
  const q = item?.quantity ?? item?.qty ?? item?.count ?? item?.orderQuantity ?? item?.orderQty ?? 1;
  const n = Number(q);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

const extractPrice = (item) => {
  const p = item?.price ?? item?.salePrice ?? item?.productPrice ?? item?.product?.price ?? 0;
  const n = Number(p);
  return Number.isFinite(n) ? n : 0;
};

const extractName = (item, idx) =>
  item?.name ?? item?.productName ?? item?.product?.name ?? `Product #${item?.productId ?? item?.product?.id ?? idx + 1}`;

const extractKey = (item, idx) =>
  item?.cartItemId ?? item?.orderItemId ?? item?.id ?? item?.productId ?? item?.product?.id ?? `${extractName(item, idx)}-${idx}`;

const OrderComplete = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { orders, cartItems, currency } = useContext(ShopGlobalCommonContext);
  const { loginUser } = useUserContext();

  // ✅ 공용 key (로그인 전/후 상관없이 항상 유지)
  const STORAGE_KEY_GLOBAL = "lastOrder";

  // ✅ 유저별 key
  const STORAGE_KEY_USER = useMemo(() => {
    const uid = loginUser?.userId;
    return uid ? `lastOrder:${uid}` : null;
  }, [loginUser?.userId]);

  const [timedOut, setTimedOut] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const savedSigRef = useRef("");

  const saveOrderToStorage = (orderObj) => {
    if (!orderObj) return;
    const json = JSON.stringify(orderObj);

    // ✅ 무조건 공용 key 저장
    sessionStorage.setItem(STORAGE_KEY_GLOBAL, json);

    // ✅ 유저가 있으면 유저 key도 저장
    if (STORAGE_KEY_USER) sessionStorage.setItem(STORAGE_KEY_USER, json);
  };

  const readOrderFromStorage = () => {
    // 1) 유저 key 우선
    if (STORAGE_KEY_USER) {
      const s = sessionStorage.getItem(STORAGE_KEY_USER);
      const p = s ? safeJsonParse(s) : null;
      if (p) return p;
    }
    // 2) 공용 key fallback
    const s2 = sessionStorage.getItem(STORAGE_KEY_GLOBAL);
    const p2 = s2 ? safeJsonParse(s2) : null;
    return p2 ?? null;
  };

  // ✅ 타임아웃(안내 문구 표시)
  useEffect(() => {
    setTimedOut(false);
    const id = setTimeout(() => setTimedOut(true), 2000);
    return () => clearTimeout(id);
  }, []);

  // ✅ 핵심 로직
  useEffect(() => {
    // 1) state 최우선
    const fromState = normalizeOrder(location?.state);
    if (fromState) {
      // 같은걸 무한 저장/세팅 방지
      const sig = JSON.stringify({ orderId: fromState?.orderId, orderDate: fromState?.orderDate, createdAt: fromState?.createdAt });
      if (savedSigRef.current !== sig) {
        savedSigRef.current = sig;
        setCurrentOrder(fromState);
        saveOrderToStorage(fromState);
      }
      return;
    }

    // 2) storage 복원 (유저키 → 공용키)
    const fromStorage = readOrderFromStorage();
    if (fromStorage) {
      setCurrentOrder(fromStorage);
      // orders로 업그레이드는 “있으면만”
    }

    // 3) orders에서 최신 주문 업그레이드 (여기선 필터링 하지 말고 그냥 최신)
    //    (네 DTO가 userId를 안 내려주면 필터링하면 100% 실패함)
    const arr = Array.isArray(orders) ? orders : [];
    if (arr.length > 0) {
      const latest = [...arr].sort((a, b) => {
        const at = new Date(a?.createdAt || a?.orderDate || 0).getTime();
        const bt = new Date(b?.createdAt || b?.orderDate || 0).getTime();
        if (bt !== at) return bt - at;
        return Number(b?.orderId || 0) - Number(a?.orderId || 0);
      })[0];

      if (latest) {
        setCurrentOrder(latest);
        saveOrderToStorage(latest);
        return;
      }
    }

    // 4) fallback: cartItems 임시 주문
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const temp = { cartItems, currency };
      setCurrentOrder(temp);
      saveOrderToStorage(temp);
      return;
    }

    // 5) 아무것도 없으면 null
    if (!fromStorage) setCurrentOrder(null);
  }, [location?.state, STORAGE_KEY_USER, orders, cartItems, currency]);

  const items = useMemo(() => extractItems(currentOrder), [currentOrder]);
  const cur = useMemo(() => currentOrder?.currency ?? currency, [currentOrder, currency]);

  // ✅ 디버깅용 로그 (일단 넣고 확인해봐)
  useEffect(() => {
    console.log("[OrderComplete] state=", location?.state);
    console.log("[OrderComplete] storage(user)=", STORAGE_KEY_USER ? sessionStorage.getItem(STORAGE_KEY_USER) : null);
    console.log("[OrderComplete] storage(global)=", sessionStorage.getItem(STORAGE_KEY_GLOBAL));
    console.log("[OrderComplete] currentOrder=", currentOrder);
    console.log("[OrderComplete] items.length=", items?.length);
  }, [location?.state, STORAGE_KEY_USER, currentOrder, items?.length]);

  if (!currentOrder) {
    return (
      <LayoutOne headerTop="visible">
        <div className="checkout-area pt-90 pb-100 text-center">
          <h2>{t("order.loading")}</h2>
          {timedOut && (
            <>
              <p style={{ marginTop: 12 }}>
                {t("order.success_message")}
                <br />
                (주문 정보를 불러오지 못했습니다. 주문 내역에서 확인해주세요)
              </p>
              <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>{t("order.go_to_orders") || "주문 내역으로"}</Link>
                <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>{t("order.continue_shopping")}</Link>
              </div>
            </>
          )}
        </div>
      </LayoutOne>
    );
  }

  if (!items || items.length === 0) {
    return (
      <LayoutOne headerTop="visible">
        <div className="checkout-area pt-90 pb-100 text-center">
          <h2>{t("order.thank_you")}</h2>
          <p style={{ marginTop: 12 }}>
            {t("order.success_message")}
            <br />
            (주문 상품 정보가 없어서 요약을 표시할 수 없습니다)
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to={process.env.PUBLIC_URL + "/my-account"}>{t("order.go_to_orders") || "주문 내역으로"}</Link>
            <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>{t("order.continue_shopping")}</Link>
          </div>
        </div>
      </LayoutOne>
    );
  }

  const orderTotal = items.reduce((total, item) => {
    const price = extractPrice(item);
    const qty = extractQty(item);
    const discountedPrice = item?.discount != null ? price * (1 - Number(item.discount) / 100) : price;
    const rate = Number(cur?.currencyRate ?? 1);
    return total + discountedPrice * rate * qty;
  }, 0);

  return (
    <Fragment>
      <SEO titleTemplate={t("order.complete_title")} description={t("order.complete_description")} />
      <LayoutOne headerTop="visible">
        <div className="checkout-area pt-90 pb-100">
          <div className="container">
            <div className="checkout-wrapper">
              <div className="checkout-success text-center" >
                <div className="checkout-success-content">
                  <h2>{t("order.thank_you")}</h2>
                  <p>{t("order.success_message")}</p>
                  <h4 className="mt-20 fs-4">
                    {t("order.total")}: <span>{formatPrice(orderTotal, cur)}</span>
                  </h4>
                  <div className="checkout-success-btn mt-30">
                    <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>{t("order.continue_shopping")}</Link>
                  </div>
                </div>
              </div>

              <div className="order-summary mt-50 text-center">
                <h4>{t("order.summary")}</h4>
                <ul className="text-start d-inline-block mt-20">
                  {items.map((item, idx) => {
                    const price = extractPrice(item);
                    const qty = extractQty(item);
                    const discountedPrice = item?.discount != null ? price * (1 - Number(item.discount) / 100) : price;
                    return (
                      <li key={extractKey(item, idx)} className="fs-6">
                        {extractName(item, idx)} × {qty}
                        <span className="mx-2">
                          {formatPrice(discountedPrice * qty * Number(cur?.currencyRate ?? 1), cur)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div style={{ marginTop: 20 }}>
                  <Link to={process.env.PUBLIC_URL + "/my-account"}>{t("order.go_to_orders") || "주문 내역으로"}</Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default OrderComplete;
