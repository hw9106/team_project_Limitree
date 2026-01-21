package com.itwill.product.dto;


import com.itwill.product.entity.ProductVariationSize;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Size {

    private Long id;

    private String name;
    private Integer stock;

    public ProductVariationSize toEntity(){
        return ProductVariationSize.builder()
                                   .id(id)
                                   .name(name)
                                   .stock(stock)
                                   .build();
    }
}
