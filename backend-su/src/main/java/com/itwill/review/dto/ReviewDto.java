package com.itwill.review.dto;

import lombok.*;


import java.time.LocalDate;

import com.itwill.review.entity.Review;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {

    private Long reviewId;
    private Long productId;
    private String userId;
    private String userName;
    private int rating;
    private String content;
    private LocalDate createdAt;

    public static ReviewDto fromEntity(Review review) {
        return ReviewDto.builder()
                .reviewId(review.getReviewId())
                .productId(review.getProduct().getId()) 
                .userId(review.getUserId())
                .userName(review.getUserName())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
