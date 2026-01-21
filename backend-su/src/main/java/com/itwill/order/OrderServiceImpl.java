package com.itwill.order;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itwill.order.dto.OrderDto;
import com.itwill.order.dto.OrderItemDto;
import com.itwill.order.entity.Order;
import com.itwill.order.entity.OrderItem;
import com.itwill.order.repository.OrderItemRepository;
import com.itwill.order.repository.OrderRepository;
import com.itwill.product.entity.Product;
import com.itwill.product.repository.ProductRepository;
import com.itwill.user.entity.User;
import com.itwill.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.Builder;

@Builder
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository; // 지금은 사용 안 해도 놔둬도 됨

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ 기존 호출 유지용
     * - 컨트롤러/테스트에서 createOrder(orderDto) 호출하던 코드 깨지지 않게 유지
     * - 단, Order.user가 nullable=false면 userId 없이 저장 시 DB에서 실패할 수 있음
     */
    @Override
    @Transactional
    public OrderDto createOrder(OrderDto orderDto) throws Exception {
        return createOrderInternal(orderDto, null);
    }

    /**
     * ✅ 추가: JWT 기반 주문 생성 (userId를 받아서 주문 소유자 연결)
     */
    @Override
    @Transactional
    public OrderDto createOrder(OrderDto orderDto, String userId) throws Exception {
        return createOrderInternal(orderDto, userId);
    }

    /**
     * ✅ 공통 주문 생성 로직(기존 로직 그대로 유지 + user 연결만 추가)
     */
    private OrderDto createOrderInternal(OrderDto orderDto, String userId) throws Exception {

        System.out.println("### createOrder called ###");

        // 입력 유효성 검증 (orderDto null 먼저!)
        if (orderDto == null) {
            throw new IllegalArgumentException("주문 정보가 없습니다.");
        }
        if (orderDto.getCustomerName() == null || orderDto.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("customerName 값이 비어있습니다.");
        }
        if (orderDto.getShippingAddress() == null || orderDto.getShippingAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("shippingAddress 값이 비어있습니다.");
        }
        if (orderDto.getPhoneNumber() == null || orderDto.getPhoneNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("phoneNumber 값이 비어있습니다.");
        }
        if (orderDto.getOrderItems() == null || orderDto.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("주문 상품이 없습니다.");
        }

        // DTO → Entity 변환 (Order 기본정보)
        Order order = orderDto.toEntity();

        // ✅ userId가 있으면 소유자 연결 (내 주문 기능 핵심)
        if (userId != null && !userId.trim().isEmpty()) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자 없음 userId=" + userId));
            order.setUser(user);
        }

        // OrderItem 추가 (너 기존 로직 그대로)
        for (OrderItemDto itemDto : orderDto.getOrderItems()) {

            // productId 유효성 검증
            if (itemDto.getProductId() == null || itemDto.getProductId() <= 0) {
                throw new IllegalArgumentException(
                        "유효하지 않은 상품 ID입니다. productId=" + itemDto.getProductId());
            }

            // quantity 유효성 검증
            if (itemDto.getQuantity() == null || itemDto.getQuantity() <= 0) {
                throw new IllegalArgumentException(
                        "수량은 1 이상이어야 합니다. productId=" + itemDto.getProductId());
            }

            // 상품 조회
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "상품을 찾을 수 없습니다. 상품 ID: " + itemDto.getProductId()));

            // 가격 null 체크
            if (product.getPrice() == null) {
                throw new IllegalStateException(
                        "상품 가격이 null 입니다. productId=" + itemDto.getProductId());
            }

            // DTO → Entity 변환
            OrderItem orderItem = itemDto.toEntity();
            orderItem.setProduct(product);        // Product 설정
            orderItem.setPrice(product.getPrice()); // 서버에서 가격 결정

            // 양방향 관계 설정
            order.addOrderItem(orderItem);
        }

        // 총 금액 계산
        order.calculateTotalAmount();

        // 저장 (cascade로 orderItems도 같이 저장됨)
        Order savedOrder = orderRepository.save(order);

        return OrderDto.toDto(savedOrder);
    }

    @Override
    @Transactional
    public OrderDto getOrderById(Long orderId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found: " + orderId));
        return OrderDto.toDto(order);
    }

    @Override
    @Transactional
    public List<OrderDto> getAllOrders() throws Exception {
        List<OrderDto> orderDtoList = new ArrayList<>();
        List<Order> orders = orderRepository.findAll();

        for (Order order : orders) {
            orderDtoList.add(OrderDto.toDto(order));
        }

        return orderDtoList;
    }

    /**
     * ✅ 추가: 내 주문 목록 조회
     * - OrderRepository에 findByUser_UserIdOrderByOrderDateDesc(String userId) 필요
     */
    @Override
    @Transactional
    public List<OrderDto> getMyOrders(String userId) throws Exception {

        if (userId == null || userId.trim().isEmpty()) {
            return new ArrayList<>();
        }

        List<Order> orders = orderRepository.findByUser_UserIdOrderByOrderDateDesc(userId);

        List<OrderDto> dtoList = new ArrayList<>();
        for (Order order : orders) {
            dtoList.add(OrderDto.toDto(order));
        }
        return dtoList;
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String orderStatus) throws Exception {

        if (orderStatus == null || orderStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("orderStatus 값이 비어있습니다.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found: " + orderId));

        order.setOrderStatus(orderStatus);

        return OrderDto.toDto(order);
    }

    @Override
    @Transactional
    public int deleteOrder(Long orderId) throws Exception {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new Exception("Order not found: " + orderId));

            orderRepository.delete(order);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    @Transactional
    public int deleteAllOrders() {

        // 1) 자식 먼저 삭제 (FK 때문에 필수)
        orderItemRepository.deleteAllOrderItems();

        // 2) 부모 삭제
        return orderRepository.deleteAllOrders();
    }
}
