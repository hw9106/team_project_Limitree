// hooks/useOrders.js
import { useEffect, useMemo, useState } from "react";
import cogoToast from "cogo-toast";
import * as orderApi from "../api/orderApi";
import * as responseStatusCode from "../api/ResponseStatusCode"; // ✅ 만료코드 쓰면


// ✅ (추가) 내 주문 전용 훅
export const useMyOrders = (userId, initialOrders = []) => {
  const [orders, setOrders] = useState(
    Array.isArray(initialOrders) ? initialOrders : []
  );

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await orderApi.orderMyList(); // ✅ 내 주문만
        console.log("orderMyList res =", res);
        // ✅ JWT 만료/토큰 에러 대응
        if (
          res?.status === responseStatusCode.ERROR_EXPIRED_TOKEN ||
          res?.status === responseStatusCode.ERROR_ACCESS_TOKEN
        ) {
          setOrders([]);
          cogoToast.warn(res?.message || "로그인이 만료되었습니다. 다시 로그인 해주세요.", {
            position: "bottom-left",
          });
          return;
        }

        // ✅ 성공인데 data가 배열인지 확인
        const list = Array.isArray(res?.data) ? res.data : [];
        // 혹시 data 안에 content로 오는 경우도 방어
        const list2 = Array.isArray(res?.data?.content) ? res.data.content : null;

        setOrders(list2 ?? list);
      } catch (error) {
        console.error("내 주문 목록 불러오기 실패:", error);
        setOrders([]);
      }
    };

    fetchMyOrders();
  }, [userId]);

  // (선택) 너가 쓰던 lastBillingInfo 유지하고 싶으면 같이 제공
  const lastBillingInfo = useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) return null;

    const sorted = [...orders].sort((a, b) => {
      const at = new Date(a.createdAt || a.orderDate || 0).getTime();
      const bt = new Date(b.createdAt || b.orderDate || 0).getTime();
      if (bt !== at) return bt - at;
      return Number(b.orderId || 0) - Number(a.orderId || 0);
    });

    const last = sorted[0];
    if (!last) return null;

    if (last.billingInfo) return last.billingInfo;

    return {
      firstName: last.customerName ?? "",
      lastName: "",
      companyName: "",
      country: "",
      streetAddress: last.shippingAddress ?? "",
      addressLine2: "",
      city: "",
      state: "",
      zip: last.postalCode ?? "",
      phone: last.phoneNumber ?? "",
      email: "",
      orderNotes: last.orderMemo ?? "",
    };
  }, [orders]);

  return { orders, setOrders, lastBillingInfo };
};

export const useOrders = (userId, initialOrders = []) => {
  const [orders, setOrders] = useState(Array.isArray(initialOrders) ? initialOrders : []);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await orderApi.orderList(); // ✅ 전체조회 API라 userId 필요 없음

        // ✅ 1) JWT 만료/토큰 에러 대응 (네 코드 스타일에 맞춰)
        if (
          res?.status === responseStatusCode.ERROR_EXPIRED_TOKEN ||
          res?.status === responseStatusCode.ERROR_ACCESS_TOKEN
        ) {
          setOrders([]);
          cogoToast.warn(res?.message || "로그인이 만료되었습니다. 다시 로그인 해주세요.", {
            position: "bottom-left",
          });
          return;
        }

        // ✅ 2) 성공인데 data가 배열인지 확인
        const list = Array.isArray(res?.data) ? res.data : [];

        // 혹시 data 안에 content로 오는 경우도 방어
        const list2 = Array.isArray(res?.data?.content) ? res.data.content : null;

        setOrders(list2 ?? list);
      } catch (error) {
        console.error("주문 목록 불러오기 실패:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [userId]);

  const lastBillingInfo = useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) return null;

    const sorted = [...orders].sort((a, b) => {
      const at = new Date(a.createdAt || 0).getTime();
      const bt = new Date(b.createdAt || 0).getTime();
      if (bt !== at) return bt - at;
      return Number(b.orderId || 0) - Number(a.orderId || 0);
    });

    const last = sorted[0];
    if (!last) return null;

    if (last.billingInfo) return last.billingInfo;

    return {
      firstName: last.customerName ?? "",
      lastName: "",
      companyName: "",
      country: "",
      streetAddress: last.shippingAddress ?? "",
      addressLine2: "",
      city: "",
      state: "",
      zip: last.postalCode ?? "",
      phone: last.phoneNumber ?? "",
      email: "",
      orderNotes: last.orderMemo ?? "",
    };
  }, [orders]);

  const addOrder = async (orderData) => {
    try {
      if (!userId) {
        cogoToast.error("로그인이 필요합니다", { position: "bottom-left" });
        return null;
      }

      const sendData = {
        ...orderData,
        userId,
        createdAt: new Date().toISOString(),
      };

      const res = await orderApi.orderCreate(sendData);

      if (res?.status === responseStatusCode.ERROR_EXPIRED_TOKEN || res?.status === responseStatusCode.ERROR_ACCESS_TOKEN) {
        cogoToast.warn(res?.message || "로그인이 만료되었습니다. 다시 로그인 해주세요.", { position: "bottom-left" });
        return null;
      }

      if (res?.status === 1) {
        const newOrder = res.data;
        setOrders((prev) => [...prev, newOrder]);
        cogoToast.success("주문이 완료되었습니다!", { position: "bottom-left" });
        return newOrder;
      }

      cogoToast.error("주문 실패: " + (res?.msg ?? res?.message ?? "알 수 없는 오류"), {
        position: "bottom-left",
      });
      return null;
    } catch (error) {
      console.error("주문 생성 실패:", error);
      cogoToast.error("주문 중 오류가 발생했습니다", { position: "bottom-left" });
      return null;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await orderApi.orderCancel(orderId);

      if (res?.status === responseStatusCode.ERROR_EXPIRED_TOKEN || res?.status === responseStatusCode.ERROR_ACCESS_TOKEN) {
        cogoToast.warn(res?.message || "로그인이 만료되었습니다. 다시 로그인 해주세요.", { position: "bottom-left" });
        return;
      }

      if (res?.status === 1) {
        setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
        cogoToast.info("주문이 취소되었습니다", { position: "bottom-left" });
      } else {
        cogoToast.error("주문 취소 실패", { position: "bottom-left" });
      }
    } catch (error) {
      console.error("주문 취소 실패:", error);
      cogoToast.error("주문 취소 중 오류가 발생했습니다", { position: "bottom-left" });
    }
  };

  const deleteAllOrders = async () => {
    try {
      const res = await orderApi.orderDeleteAll();
      if (res?.status === 1) {
        setOrders([]);
        cogoToast.info("모든 주문이 삭제되었습니다", { position: "bottom-left" });
      }
    } catch (error) {
      console.error("주문 전체 삭제 실패:", error);
      cogoToast.error("주문 삭제 중 오류가 발생했습니다", { position: "bottom-left" });
    }
  };

  return { orders, setOrders, addOrder, deleteOrder, deleteAllOrders, lastBillingInfo };
};
