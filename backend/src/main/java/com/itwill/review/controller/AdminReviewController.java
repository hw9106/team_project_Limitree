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
@RequestMapping("/reviews/admin")
@CrossOrigin(origins = { "http://localhost:3000",
        "http://172.21.48.1:3000"
}, allowCredentials = "true")

public class AdminReviewController {
    @Autowired
    private ReviewService reviewService;

    @Operation(summary = "리뷰 삭제")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Response> admin_reviews_remove_action(@PathVariable("reviewId") Long reviewId,
            HttpSession session)
            throws Exception {
        reviewService.remove(reviewId);
        Response response = new Response();
        response.setStatus(1);
        response.setMessage("리뷰 삭제 성공");
        response.setData(reviewId);
        return ResponseEntity.ok().body(response);
    }

}
