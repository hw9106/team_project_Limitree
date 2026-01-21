package com.itwill.cart.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itwill.cart.dto.CartDtoSingle;
import com.itwill.product.entity.Product;
import com.itwill.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor
@ToString(exclude = "user")
@Table(name = "cart")
@Entity(name="cart")
public class Cart {

    @Id
    @Column(name = "cart_item_id")
    private String cartItemId;
    // product Id - FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid")
    @JsonIgnore 
    private Product product;    

    // user ID - FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid")
    @JsonIgnore 
    private User user; 
    // quantity
    private Integer quantity;
     
    private String selectedProductColor;
    private String selectedProductSize;

    public static Cart toEntitySingle(CartDtoSingle cartDtoSingle) {
        return Cart.builder()
                .cartItemId(cartDtoSingle.getCartItemId())
                .product(Product.builder()
                     .id(cartDtoSingle.getId())
                     .build())
                .user(User.builder().userId(cartDtoSingle.getUserId()).build())
                .quantity(cartDtoSingle.getQuantity())
                .selectedProductColor(cartDtoSingle.getSelectedProductColor())
                .selectedProductSize(cartDtoSingle.getSelectedProductSize())
                .build();
    }      
}
