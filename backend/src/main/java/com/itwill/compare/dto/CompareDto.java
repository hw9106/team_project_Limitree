package com.itwill.compare.dto;

import com.itwill.compare.entity.Compare;
import com.itwill.product.dto.ProductDto;
import com.itwill.product.entity.Product;
import com.itwill.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class CompareDto {

    private String compareItemId;
    // User FK 
    private String userId;
    // Product FK + Product 정보
    private Long productId;
    private ProductDto productDto;

public static Compare toEntity(CompareDto compareDto){
    return Compare.builder()
                  .compareItemId(compareDto.compareItemId)
                  .user(User.builder().userId(compareDto.getUserId()).build())
                  .product(Product.builder().id(compareDto.getProductId()).build())
                  .build();
}
        
}
