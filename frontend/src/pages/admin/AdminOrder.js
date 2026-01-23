import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import cogoToast from "cogo-toast";
import { orderList, orderCancel, orderDeleteAll } from "../../api/orderApi"; // 주문 API

const AdminOrder = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);
  const handleDeleteAllOrders = async () => {
    if (!window.confirm("모든 주문을 삭제하시겠습니까?")) return;

    try {
      const response = await orderDeleteAll();

      // 백엔드가 {status:1, msg:'...', data:{deletedCount:...}} 형태라면
      if (response && (response.status === 1 || response.status === 200)) {
        cogoToast.success(response?.msg || "모든 주문이 삭제되었습니다.");
        loadOrders(); // ✅ DB 기준으로 다시 로딩
      } else {
        cogoToast.error(
          response?.msg || response?.message || "전체 삭제에 실패했습니다."
        );
      }
    } catch (e) {
      console.error("전체 주문 삭제 실패:", e);
      cogoToast.error(e?.message || "전체 삭제에 실패했습니다.");
    }
  };

  const loadOrders = async () => {
    try {
      // 실제 API 호출로 DB 데이터 가져오기
      const response = await orderList();

      console.log("API 응답:", response); // 디버깅용
      console.log("response.status:", response?.status); // 디버깅용
      console.log("response.data:", response?.data); // 디버깅용

      // 응답이 있고 데이터가 배열이면 성공으로 처리
      // status 1 또는 200이면 성공
      if (response && response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        cogoToast.success(`${response.data.length}개의 주문을 불러왔습니다.`);
      } else if (
        response &&
        (response.status === 200 || response.status === 1)
      ) {
        setOrders(response.data || []);
        cogoToast.success("주문 목록을 불러왔습니다.");
      } else {
        console.log("응답 실패:", response); // 디버깅용
        setOrders([]); // 빈 배열로 초기화
        cogoToast.warn(response?.message || "주문 내역이 없습니다.");
      }
    } catch (error) {
      console.error("주문 목록 로딩 실패:", error);
      setOrders([]); // 빈 배열로 초기화
      cogoToast.error("주문 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // TODO: adminApi.js 만들어지면 실제 API 호출로 교체
      // const response = await adminUpdateOrderStatus(orderId, newStatus);
      // if (response.status === 200) {
      //   cogoToast.success('주문 상태가 업데이트되었습니다.');
      //   loadOrders();
      // }

      // 임시: 로컬 상태만 업데이트
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
      cogoToast.success("주문 상태가 업데이트되었습니다.");
    } catch (error) {
      console.error("주문 상태 업데이트 실패:", error);
      cogoToast.error("주문 상태 업데이트에 실패했습니다.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("정말 이 주문을 삭제하시겠습니까?")) {
      return;
    }

    try {
      // 실제 API 호출로 주문 삭제
      const response = await orderCancel(orderId);

      if (response && (response.status === 200 || response.status === 1)) {
        cogoToast.success("주문이 삭제되었습니다.");
        loadOrders(); // 목록 새로고침
      } else {
        cogoToast.error(response?.message || "주문 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("주문 삭제 실패:", error);
      cogoToast.error("주문 삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("ko-KR") + "원";
  };

  return (
    <div>
      <div className="cart-main-area pt-90 pb-100">
        <div className="container">
          {orders && orders.length >= 1 ? (
            <div>
              <h3 className="cart-page-title">{t("admin.order_list")}</h3>

              <div className="row">
                <div className="col-12">
                  <div className="table-content table-responsive cart-table-content">
                    <table>
                      <thead>
                        <tr>
                          <th>주문번호</th>
                          <th>고객명</th>
                          <th>주문일시</th>
                          <th>주문상품</th>
                          <th>총액</th>
                          <th>상태</th>
                          <th>배송지</th>
                          <th>연락처</th>
                          <th>삭제</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.orderId}>
                            <td>
                              <strong>#{order.orderId}</strong>
                            </td>

                            <td className="product-name">
                              {order.customerName}
                            </td>

                            <td>
                              <small>{formatDate(order.orderDate)}</small>
                            </td>

                            <td>
                              {order.orderItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="cart-item-variation"
                                >
                                  <span>
                                    {item.productName} x {item.quantity}
                                  </span>
                                </div>
                              ))}
                            </td>

                            <td className="product-price-cart">
                              <span className="amount">
                                {formatPrice(order.totalAmount)}
                              </span>
                            </td>

                            <td className="product-quantity">
                              <select
                                className="cart-plus-minus-box"
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    order.orderId,
                                    e.target.value
                                  )
                                }
                                style={{ width: "120px", padding: "5px" }}
                              >
                                <option value="PENDING">대기중</option>
                                <option value="CONFIRMED">확인됨</option>
                                <option value="SHIPPING">배송중</option>
                                <option value="DELIVERED">배송완료</option>
                                <option value="CANCELLED">취소됨</option>
                              </select>
                            </td>

                            <td>
                              <small>{order.shippingAddress}</small>
                            </td>

                            <td>
                              <small>{order.phoneNumber}</small>
                            </td>

                            <td className="product-remove">
                              <button
                                onClick={() => handleDeleteOrder(order.orderId)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
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
                      <Link to={process.env.PUBLIC_URL + "/admin/product"}>
                        상품 관리로 이동
                      </Link>
                    </div>
                    <div className="cart-clear">
                      <button onClick={handleDeleteAllOrders}>전체 삭제</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 통계 정보 */}
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <div className="cart-tax">
                    <div className="title-wrap">
                      <h4 className="cart-bottom-title section-bg-gray">
                        주문 통계
                      </h4>
                    </div>
                    <div className="tax-wrapper">
                      <p>총 주문 수: {orders.length}건</p>
                      <p>
                        대기중:{" "}
                        {orders.filter((o) => o.status === "PENDING").length}건
                      </p>
                      <p>
                        배송중:{" "}
                        {orders.filter((o) => o.status === "SHIPPING").length}건
                      </p>
                      <p>
                        완료:{" "}
                        {orders.filter((o) => o.status === "DELIVERED").length}
                        건
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="discount-code-wrapper">
                    <div className="title-wrap">
                      <h4 className="cart-bottom-title section-bg-gray">
                        주문 검색
                      </h4>
                    </div>
                    <div className="discount-code">
                      <p>주문번호 또는 고객명으로 검색</p>
                      <form>
                        <input type="text" placeholder="검색어 입력" />
                        <button className="cart-btn-2" type="button">
                          검색
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-12">
                  <div className="grand-totall">
                    <div className="title-wrap">
                      <h4 className="cart-bottom-title section-bg-gary-cart">
                        총 매출
                      </h4>
                    </div>
                    <h5>
                      전체 주문 <span>{orders.length}건</span>
                    </h5>
                    <h4 className="grand-totall-title">
                      총 매출액{" "}
                      <span>
                        {formatPrice(
                          orders.reduce(
                            (sum, order) => sum + order.totalAmount,
                            0
                          )
                        )}
                      </span>
                    </h4>
                    <Link to={process.env.PUBLIC_URL + "/admin/product"}>
                      상품 관리
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-note2"></i>
                  </div>
                  <div className="item-empty-area__text">
                    주문 내역이 없습니다.
                    <br />
                    <Link to={process.env.PUBLIC_URL + "/admin-product"}>
                      상품 관리로 이동
                    </Link>
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

export default AdminOrder;
