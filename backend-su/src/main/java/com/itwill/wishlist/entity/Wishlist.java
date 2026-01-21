package com.itwill.wishlist.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itwill.cart.dto.CartDtoSingle;
import com.itwill.product.entity.Product;
import com.itwill.user.entity.User;
import com.itwill.wishlist.dto.WishlistDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
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
@Table(name = "wishlist")
@Entity(name="wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "wishlist_seq")
    @SequenceGenerator(name = "wishlist_seq",sequenceName = "wishlist_seq",allocationSize = 1)
    private Long wishlistId;
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

    public static Wishlist toEntity(WishlistDto wishlistDto) {
        return Wishlist.builder()
                .wishlistId(wishlistDto.getWishlistId())
                .product(Product.builder()
                     .id(wishlistDto.getId())
                     .build())
                .user(User.builder().userId(wishlistDto.getUserId()).build())
                .build();
   }      
}