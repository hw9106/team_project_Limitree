package com.itwill.review;
import com.itwill.product.entity.Product;
import com.itwill.product.repository.ProductRepository;
import com.itwill.review.dto.ReviewDto;
import com.itwill.review.entity.Review;
import com.itwill.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Override
    public Long reviewCreate(ReviewDto reviewDto) throws Exception {
        System.out.println("reviewDto     :::::::  " + reviewDto.getContent() + "  :: "+ reviewDto.getUserName());
        Review reviewEntity = Review.toEntity(reviewDto);

        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!CartEntity.getQuantity    :::: " + reviewEntity.getReviewId());
        Review saved = reviewRepository.save(reviewEntity);
        return saved.getReviewId();
    }

    @Override
    public List<ReviewDto> getReviewsByProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품 없음"));

        return reviewRepository.findByProduct(product)
                .stream()
                .map(ReviewDto::fromEntity)
                .toList();
    }

    @Override
    public List<ReviewDto> getReviews() {
        System.out.println("박성섭  ::::: " + reviewRepository.findAll().isEmpty());
        // TODO Auto-generated method stub
        return reviewRepository.findAll()
                .stream()
                .map(ReviewDto::fromEntity)
                .toList();
    }

    @Override
    public int remove(Long reviewId) throws Exception {
        reviewRepository.deleteById(reviewId);
        return 0;
    }

}
