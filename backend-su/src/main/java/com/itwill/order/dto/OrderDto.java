

package com.itwill.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.itwill.order.entity.Order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderDto {
    
    // 조회 시에만 사용 (생성 시 null)
    private Long orderId;
    private LocalDateTime orderDate;
    private String orderStatus;
    private BigDecimal totalAmount;
    
    // 공통 필드 (생성 + 조회)
    private String customerName;
    private String postalCode;
    private String shippingAddress;
    private String phoneNumber;
    private String orderMemo;
    private List<OrderItemDto> orderItems;
    
    // Entity → DTO (조회 시)
    public static OrderDto toDto(Order entity) {
        return OrderDto.builder()
            .orderId(entity.getOrderId())
            .customerName(entity.getCustomerName())
            .postalCode(entity.getPostalCode())
            .shippingAddress(entity.getShippingAddress())
            .phoneNumber(entity.getPhoneNumber())
            .orderMemo(entity.getOrderMemo())
            .orderDate(entity.getOrderDate())
            .orderStatus(entity.getOrderStatus())
            .totalAmount(entity.getTotalAmount())
            .orderItems(entity.getOrderItems().stream()
                .map(OrderItemDto::toDto)
                .collect(Collectors.toList()))
            .build();
    }

    // DTO → Entity (생성 시)
    public Order toEntity() {
        Order order = Order.builder()
            .orderId(this.orderId)
            .customerName(this.customerName)
            .postalCode(this.postalCode)
            .shippingAddress(this.shippingAddress)
            .phoneNumber(this.phoneNumber)
            .orderMemo(this.orderMemo)
            .orderDate(this.orderDate)
            .orderStatus(this.orderStatus)
            .totalAmount(this.totalAmount)
            .build();

        // ✅ 핵심: 리스트 초기화
        order.setOrderItems(new java.util.ArrayList<>());

        return order;
}
}
