
package com.itwill.order.dto;

import java.math.BigDecimal;

import com.itwill.order.entity.OrderItem;
import com.itwill.product.dto.ProductDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderItemDto {
    
    // 조회 시에만 사용 (생성 시 null)
    private Long orderItemId;
    
    // 공통 필드 (생성 + 조회)
    private Long productId;
    private ProductDto product;  // 조회 시 포함
    private Integer quantity;
    private BigDecimal price;
    private String selectedProductColor;
    private String selectedProductSize;
    
    // Entity → DTO (조회 시)
    public static OrderItemDto toDto(OrderItem entity) {
        return OrderItemDto.builder()
            .orderItemId(entity.getOrderItemId())
            .productId(entity.getProduct().getId())
            .product(entity.getProduct().toDto())
            .quantity(entity.getQuantity())
            .price(entity.getPrice())
            .selectedProductColor(entity.getSelectedProductColor())
            .selectedProductSize(entity.getSelectedProductSize())
            .build();
    }

    // DTO → Entity (생성 시)
    // 주의: Product와 Order는 별도로 설정 필요
    public OrderItem toEntity() {
        return OrderItem.builder()
            .orderItemId(this.orderItemId)
            .quantity(this.quantity)
            .price(this.price)
            .selectedProductColor(this.selectedProductColor)
            .selectedProductSize(this.selectedProductSize)
            .build();
    }
} 