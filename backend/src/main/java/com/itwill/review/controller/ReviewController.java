package com.itwill.review.controller;

import com.itwill.review.ReviewService;
import com.itwill.review.dto.ReviewDto;
import com.itwill.user.controller.Response;
import com.itwill.user.controller.ResponseMessage;
import com.itwill.user.controller.ResponseStatusCode;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController

@RequiredArgsConstructor
@RequestMapping("/products/{productId}/reviews")
@CrossOrigin(origins = { "http://localhost:3000",
        "http://172.21.48.1:3000"
}, allowCredentials = "true")

public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Operation(summary = "리뷰 쓰기")
    @PostMapping(value = "/write")
    public ResponseEntity<Map<String, Object>> cart_write_action(@RequestBody ReviewDto reviewDto) throws Exception {

        System.out.println("############################# reviewDto.getCartItemId()    -- " + reviewDto.getContent());
        Long reviewId = reviewService.reviewCreate(reviewDto);
        System.out.println("############################# test    -- " + reviewId);

        Map<String, Object> resultMap = new HashMap<>();
        int status = 1;
        Long data = reviewId;
        String msg = "성공";

        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", reviewId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
                .body(resultMap);
    }

    @Operation(summary = "리뷰  목록")
    @GetMapping
    public List<ReviewDto> reviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @Operation(summary = "admin 리뷰  목록")
    @GetMapping(value = "/admin")
    public List<ReviewDto> reviewList() {
        return reviewService.getReviews();
    }

    @Operation(summary = "리뷰 삭제")
    @DeleteMapping("/admin/{reviewId}")
    public ResponseEntity<Response> admin_reviews_remove_action(@PathVariable("reviewId") Long reviewId,
            HttpSession session)
            throws Exception {
        reviewService.remove(reviewId);
        Response response = new Response();
        response.setStatus(ResponseStatusCode.DELETE_USER);
        response.setMessage(ResponseMessage.DELETE_USER);
        response.setData(reviewId);
        return ResponseEntity.ok().body(response);
    }

}
