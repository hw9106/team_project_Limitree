package com.itwill.review.entity;


import com.itwill.product.entity.Product;
import com.itwill.review.dto.ReviewDto;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String userId;
    private String userName;

    private int rating;

    @Column(length = 1000)
    private String content;

    private LocalDate createdAt;

    public static Review toEntity(ReviewDto reviewDto) {
        return Review.builder()
                .reviewId(reviewDto.getReviewId())
                .product(Product.builder()
                     .id(reviewDto.getProductId())
                     .build())
                .userId(reviewDto.getUserId())
                .userName(reviewDto.getUserName())
                .rating(reviewDto.getRating())
                .content(reviewDto.getContent())
                .createdAt(reviewDto.getCreatedAt()) 
                .build();
    }  
}
