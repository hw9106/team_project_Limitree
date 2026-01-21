package com.itwill.wishlist.dto;

import com.itwill.product.dto.ProductDto;
import com.itwill.wishlist.entity.Wishlist;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class WishlistDto {
    // Wishlist ID - PK
    private Long wishlistId;
     //START product 컬럼들
    private Long id;
    private ProductDto product;
    //END product 컬럼들
    // user ID - FK
    private String userId;  

    @Schema(hidden = true)
   public static WishlistDto toDto(Wishlist wishlistEntity) {
    return WishlistDto.builder()
            .wishlistId(wishlistEntity.getWishlistId())
            .id(wishlistEntity.getProduct().getId())
            .product(wishlistEntity.getProduct().toDto())
            .userId(wishlistEntity.getUser().getUserId())
            .build();
    }
}
