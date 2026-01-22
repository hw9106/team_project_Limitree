package com.itwill.review;

import com.itwill.review.dto.ReviewDto;

import java.util.List;

public interface ReviewService {

    Long reviewCreate(ReviewDto reviewDto) throws Exception;
    List<ReviewDto> getReviewsByProduct(Long productId);
    List<ReviewDto> getReviews();
    int remove(Long reviewId) throws Exception;

}
