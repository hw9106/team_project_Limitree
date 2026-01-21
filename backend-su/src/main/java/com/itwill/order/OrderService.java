package com.itwill.order;

import java.util.List;

import com.itwill.order.dto.OrderDto;

import jakarta.transaction.Transactional;

/*
 * OrderService - 주문 서비스 인터페이스
 *
 * CartService 패턴 따름
 */
@Transactional
public interface OrderService {

    // 주문 생성

    OrderDto createOrder(OrderDto orderDto) throws Exception;

    // 주문 ID로 조회

    OrderDto getOrderById(Long orderId) throws Exception;

    // 전체 주문 목록 조회

    List<OrderDto> getAllOrders() throws Exception;

    // 주문 상태 업데이트

    OrderDto updateOrderStatus(Long orderId, String orderStatus) throws Exception;

    // 주문 삭제

    int deleteOrder(Long orderId) throws Exception;

    int deleteAllOrders() throws Exception;

    // ✅ 내 주문 목록 조회 (JWT 기반)
    OrderDto createOrder(OrderDto orderDto, String userId) throws Exception; // 추가
List<OrderDto> getMyOrders(String userId) throws Exception;             // 추가

}
