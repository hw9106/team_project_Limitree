package com.itwill.product.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.itwill.product.entity.Product;

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
public class ProductDto {


    private Long id;
    private String sku;
    private String name;
    private BigDecimal price;
    private Integer discount;
    private String offerEnd;
    private Boolean isNew;
    private Integer rating;
    private Integer saleCount;
    private List<String> category;
    private List<String> tag;
    private Integer stock;
    private List<String> image;
    private String shortDescription;
    private String fullDescription;

    private List<Variation> variation;


    
    public Product toEntity() {
    Product product = new Product();
    product.setId(this.id);  // 신규 등록 시 null, 수정 시 값 있음 (DB가 id가 null일경우 자동 생성)
    product.setSku(this.sku);
    product.setName(this.name);
    product.setPrice(this.price);
    product.setDiscount(this.discount);
    product.setOfferEnd(this.offerEnd);
    product.setIsNew(this.isNew);
    product.setRating(this.rating);
    product.setSaleCount(this.saleCount);
    product.setStock(this.stock);
    product.setShortDescription(this.shortDescription);
    product.setFullDescription(this.fullDescription);
    
    // List<String> → String 변환 (toDto의 반대)
    product.setCategory(this.category != null && !this.category.isEmpty() 
        ? String.join(",", this.category) 
        : null);
    product.setTag(this.tag != null && !this.tag.isEmpty() 
        ? String.join(",", this.tag) 
        : null);
    product.setImage(this.image != null && !this.image.isEmpty() 
        ? String.join(",", this.image) 
        : null);
    return product;    
}
}
