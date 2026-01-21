import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import { ShopGlobalCommonContext } from "../../App";
import { formatPrice } from "../../helpers/price";

const STORAGE_KEY = "lastOrder";

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

// ✅ orders에서 "최신 주문" 안정적으로 고르기 (createdAt 우선, 없으면 orderId)
const pickLatestOrder = (orders) => {
  const arr = Array.isArray(orders) ? orders : [];
  if (arr.length === 0) return null;

  const sorted = [...arr].sort((a, b) => {
    const at = new Date(a?.createdAt || 0).getTime();
    const bt = new Date(b?.createdAt || 0).getTime();
    if (bt !== at) return bt - at;
    return Number(b?.orderId || 0) - Number(a?.orderId || 0);
  });

  return sorted[0] ?? null;
};

// ✅ 다양한 필드명 대응해서 items 뽑기
const extractItems = (order) => {
  if (!order) return [];
  const candidates = [
    order.cartItems,
    order.orderItems,
    order.items,
    order.orderItemList,
    order.products,
  ];
  const found = candidates.find((x) => Array.isArray(x));
  return Array.isArray(found) ? found : [];
};

// ✅ 다양한 필드명 대응해서 qty 뽑기
const extractQty = (item) => {
  const q =
    item?.quantity ??
    item?.qty ??
    item?.count ??
    item?.orderQuantity ??
    item?.orderQty ??
    1;
  const n = Number(q);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

// ✅ 다양한 필드명 대응해서 price 뽑기
const extractPrice = (item) => {
  const p =
    item?.price ??
    item?.salePrice ??
    item?.productPrice ??
    item?.product?.price ??
    0;
  const n = Number(p);
  return Number.isFinite(n) ? n : 0;
};

// ✅ item 이름 뽑기
const extractName = (item, idx) => {
  return (
    item?.name ??
    item?.productName ??
    item?.product?.name ??
    `Product #${item?.productId ?? item?.product?.id ?? idx + 1}`
  );
};

// ✅ key 안정화
const extractKey = (item, idx) => {
  return (
    item?.cartItemId ??
    item?.orderItemId ??
    item?.id ??
    item?.productId ??
    item?.product?.id ??
    `${extractName(item, idx)}-${idx}`
  );
};

const OrderComplete = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { orders, cartItems, currency } = useContext(ShopGlobalCommonContext);

  // "계속 로딩" 방지용 상태
  const [timedOut, setTimedOut] = useState(false);

  // ✅ 첫 렌더: state > storage > null
  const [currentOrder, setCurrentOrder] = useState(() => {
    if (location?.state) return location.state;

    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? safeJsonParse(saved) : null;
    return parsed ?? null;
  });

  // ✅ 일정 시간 지나도 못 찾으면 안내 화면으로 전환
  useEffect(() => {
    setTimedOut(false);
    const id = setTimeout(() => setTimedOut(true), 2000);
    return () => clearTimeout(id);
  }, []);

  // ✅ 주문 데이터 결정 로직 (가장 중요)
  useEffect(() => {
    // 1) navigate state 최우선
    if (location?.state) {
      setCurrentOrder(location.state);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location.state));
      return;
    }

    // 2) storage가 있으면 일단 그걸로 렌더 (첫 주문에서 가장 강력한 생명줄)
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? safeJsonParse(saved) : null;
    if (parsed) {
      setCurrentOrder(parsed);
      // 아래에서 orders 최신화가 오면 업그레이드 가능
    }

    // 3) orders가 있으면 최신 주문으로 "업그레이드"
    const latest = pickLatestOrder(orders);
    if (latest) {
      setCurrentOrder(latest);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(latest));
      return;
    }

    // 4) orders도 없고 storage도 없으면 마지막 fallback: cartItems 기반 임시 주문
    // (단, 결제 완료 직후 cart 비우면 여기 못 옴 -> 그래서 위 storage가 중요)
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const temp = { cartItems, currency };
      setCurrentOrder(temp);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(temp));
      return;
    }

    // 5) 아무것도 못 찾으면 null 유지
    if (!parsed) setCurrentOrder(null);
  }, [location?.state, orders, cartItems, currency]);

  // ✅ items / currency
  const items = useMemo(() => extractItems(currentOrder), [currentOrder]);

  const cur = useMemo(() => {
    return currentOrder?.currency ?? currency;
  }, [currentOrder, currency]);

  // ✅ 로딩/안내 UI
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
                (주문 정보를 불러오지 못했습니다. 주문 목록에서 확인해주세요)
              </p>
              <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>
                  {t("order.go_to_orders") || "주문 내역으로"}
                </Link>
                <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                  {t("order.continue_shopping")}
                </Link>
              </div>
            </>
          )}
        </div>
      </LayoutOne>
    );
  }

  // items가 비어있을 때도 "성공 메시지 + 이동"은 보여주되,
  // 무한 로딩처럼 보이지 않게 정리
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
            <Link to={process.env.PUBLIC_URL + "/my-account"}>
              {t("order.go_to_orders") || "주문 내역으로"}
            </Link>
            <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
              {t("order.continue_shopping")}
            </Link>
          </div>
        </div>
      </LayoutOne>
    );
  }

  // ✅ 주문 총액 계산
  const orderTotal = items.reduce((total, item) => {
    const price = extractPrice(item);
    const qty = extractQty(item);

    // cartItems일 때만 discount 반영(없으면 그대로)
    const discountedPrice =
      item?.discount != null
        ? price * (1 - Number(item.discount) / 100)
        : price;

    const rate = Number(cur?.currencyRate ?? 1);

    return total + discountedPrice * rate * qty;
  }, 0);

  return (
    <Fragment>
      <SEO
        titleTemplate={t("order.complete_title")}
        description={t("order.complete_description")}
      />

      <LayoutOne headerTop="visible">
        <div className="checkout-area pt-90 pb-100">
          <div className="container">
            <div className="checkout-wrapper">
              {/* ===== 주문 완료 메시지 ===== */}
              <div className="checkout-success text-center">
                <div className="checkout-success-content">
                  <h2>{t("order.thank_you")}</h2>
                  <p>{t("order.success_message")}</p>

                  <h4 className="mt-20 fs-4">
                    {t("order.total")}: <span>{formatPrice(orderTotal, cur)}</span>
                  </h4>

                  <div className="checkout-success-btn mt-30">
                    <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                      {t("order.continue_shopping")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* ===== 주문 요약 ===== */}
              <div className="order-summary mt-50 text-center">
                <h4>{t("order.summary")}</h4>

                <ul className="text-start d-inline-block mt-20">
                  {items.map((item, idx) => {
                    const price = extractPrice(item);
                    const qty = extractQty(item);

                    const discountedPrice =
                      item?.discount != null
                        ? price * (1 - Number(item.discount) / 100)
                        : price;

                    const itemName = extractName(item, idx);
                    const key = extractKey(item, idx);

                    return (
                      <li key={key} className="fs-6">
                        {itemName} × {qty}
                        <span className="mx-2">
                          {formatPrice(
                            discountedPrice * qty * Number(cur?.currencyRate ?? 1),
                            cur
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* 옵션: 주문내역 가기 버튼 */}
                <div style={{ marginTop: 20 }}>
                  <Link to={process.env.PUBLIC_URL + "/my-account"}>
                    {t("order.go_to_orders") || "주문 내역으로"}
                  </Link>
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
