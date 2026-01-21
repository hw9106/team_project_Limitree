package com.itwill.cart.dto;


import com.itwill.cart.entity.Cart;
import com.itwill.product.dto.ProductDto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CartDtoSingle {
    // cart ID - PK
    //private Long cartItemId;
    private String cartItemId;

    // user ID - FK
    private String userId;  
    // quantity
    private Integer quantity;  
    //START product 컬럼들
    private Long id;
    private ProductDto product;
    //END product 컬럼들

    private String selectedProductColor;
    private String selectedProductSize;

    @Schema(hidden = true)
   public static CartDtoSingle toDto(Cart cartEntity) {
    return CartDtoSingle.builder()
            .cartItemId(cartEntity.getCartItemId())
            .id(cartEntity.getProduct().getId())
            .product(cartEntity.getProduct().toDto())
            .userId(cartEntity.getUser().getUserId())
            .quantity(cartEntity.getQuantity())
            .selectedProductColor(cartEntity.getSelectedProductColor())
            .selectedProductSize(cartEntity.getSelectedProductSize())
            .build();
    }
}
