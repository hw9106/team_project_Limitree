package com.itwill.order.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.itwill.order.OrderService;
import com.itwill.order.dto.OrderDto;
import com.itwill.user.security.SecurityUser;

import io.swagger.v3.oas.annotations.Operation;

@RestController
public class OrderRestController {

    @Autowired
    private OrderService orderService;

    // =========================================================
    // ✅ 주문 생성 (JWT userId 기반으로 orders.userid 저장)
    // =========================================================
    @Operation(summary = "주문 생성")
    @PostMapping(value = "/order")
    public ResponseEntity<Map<String, Object>> order_create(
            @RequestBody OrderDto orderDto,
            Authentication authentication) {

        Map<String, Object> resultMap = new HashMap<>();
        int status = 1;
        String msg = "성공";
        OrderDto data = null;

        try {
            String userId = null;
            if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
                SecurityUser principal = (SecurityUser) authentication.getPrincipal();
                userId = principal.getUserId();
            }

            if (userId == null || userId.isBlank()) {
                status = 2;
                msg = "로그인이 필요합니다.";
            } else {
                // ✅ userId 버전 호출
                data = orderService.createOrder(orderDto, userId);
                status = 1;
                msg = "주문 생성 성공";
            }

        } catch (Exception e) {
            e.printStackTrace();
            status = 2;
            msg = "주문 생성 실패: " + e.getMessage();
        }

        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);

        return ResponseEntity
                .status(status == 1 ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
                .body(resultMap);
    }

    // =========================================================
    // ✅ (추가) 내 주문 목록 조회
    // =========================================================
    @Operation(summary = "내 주문 목록 조회", description = "로그인한 사용자 주문 목록을 조회합니다")
    @GetMapping(value = "/orders/my")
    public ResponseEntity<Map<String, Object>> order_my_list(Authentication authentication) {

        Map<String, Object> resultMap = new HashMap<>();
        int status = 1;
        String msg = "성공";
        List<OrderDto> data = null;
        
        try {
            String userId = null;
            if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
                SecurityUser principal = (SecurityUser) authentication.getPrincipal();
                userId = principal.getUserId();
                System.out.println("### /orders/my userId=" + userId);
            }

            if (userId == null || userId.isBlank()) {
                status = 2;
                msg = "로그인이 필요합니다.";
                data = List.of();
            } else {
                data = orderService.getMyOrders(userId);
                status = 1;
                msg = "내 주문 목록 조회 성공";
            }

        } catch (Exception e) {
            e.printStackTrace();
            status = 2;
            msg = "내 주문 목록 조회 실패: " + e.getMessage();
        }

        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);

        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
                .body(resultMap);
    }

    // =========================================================
    // ✅ 주문 목록 조회 (기존 유지: 전체 주문 목록)
    // - 필요하면 나중에 admin만 접근하도록 Security에서 막기
    // =========================================================
    @Operation(summary = "주문 목록 조회", description = "전체 주문 목록을 조회합니다")
    @GetMapping(value = "/orders")
    public ResponseEntity<Map<String, Object>> order_list() {
        Map<String, Object> resultMap = new HashMap<>();
        int status = 1;
        String msg = "성공";
        List<OrderDto> data = null;

        try {
            data = orderService.getAllOrders();
            status = 1;
            msg = "주문 목록 조회 성공";
        } catch (Exception e) {
            e.printStackTrace();
            status = 2;
            msg = "주문 목록 조회 실패: " + e.getMessage();
        }

        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);

        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
                .body(resultMap);
    }

    // =========================================================
    // ✅ 주문 상세 조회
    // =========================================================
    @Operation(summary = "주문 상세 조회", description = "주문 ID로 특정 주문을 조회합니다")
    @GetMapping(value = "/order/{orderId}")
    public ResponseEntity<Map<String, Object>> order_detail(@PathVariable Long orderId) {
        Map<String, Object> resultMap = new HashMap<>();
        int status = 1;
        String msg = "성공";
        OrderDto data = null;

        try {
            data = orderService.getOrderById(orderId);
            status = 1;
            msg = "주문 조회 성공";
        } catch (Exception e) {
            e.printStackTrace();
            status = 2;
            msg = "주문 조회 실패: " + e.getMessage();
        }

        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);

        return ResponseEntity
                .status(status == 1 ? HttpStatus.OK : HttpStatus.NOT_FOUND)
                .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
                .body(resultMap);
    }

    // =========================================================
    // ✅ 주문 상태 수정
    // =========================================================
    @Operation(summary = "주문 상태 수정", description = "주문 상태를 업데이트합니다")
    @PatchMapping(value = "/order/{orderId}/status")
    public ResponseEntity<Map<String, Object>> order_update_status(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> requestBody) {

        Map<String, Object> resultMap = new HashMap<>();
        int status = 1;
        String msg = "성공";
        OrderDto data = null;

        try {
            String orderStatus = requestBody.get("orderStatus");
            data = orderService.updateOrderStatus(orderId, orderStatus);
            status = 1;
            msg = "주문 상태 수정 성공";
        } catch (Exception e) {
            e.printStackTrace();
            status = 2;
            msg = "주문 상태 수정 실패: " + e.getMessage();
        }

        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);

        return ResponseEntity
                .status(status == 1 ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
                .body(resultMap);
    }

    // =========================================================
    // ✅ 주문 삭제
    // =========================================================
    @Operation(summary = "주문 삭제")
    @DeleteMapping(value = "/order/{orderId}")
    public ResponseEntity<Map<String, Object>> order_delete(@PathVariable("orderId") Long orderId) {
        Map<String, Object> resultMap = new HashMap<>();
        int status = 1;
        String msg = "성공";

        try {
            int result = orderService.deleteOrder(orderId);
            if (result == 1) {
                status = 1;
                msg = "주문 삭제 성공";
            } else {
                status = 2;
                msg = "주문 삭제 실패";
            }
        } catch (Exception e) {
            e.printStackTrace();
            status = 2;
            msg = "주문 삭제 실패: " + e.getMessage();
        }

        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", orderId);

        return ResponseEntity
                .status(status == 1 ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
                .body(resultMap);
    }

    // =========================================================
    // ✅ 관리자 - 전체 주문 삭제
    // =========================================================
    @Operation(summary = "관리자 - 전체 주문 삭제")
    @DeleteMapping("/admin/orders")
    public ResponseEntity<Map<String, Object>> admin_order_delete_all() {

        Map<String, Object> resultMap = new HashMap<>();
        int status = 1;
        String msg = "성공";
        int deletedCount = 0;

        try {
            deletedCount = orderService.deleteAllOrders();
            status = 1;
            msg = "전체 주문 삭제 성공";
        } catch (Exception e) {
            e.printStackTrace();
            status = 2;
            msg = "전체 주문 삭제 실패: " + e.getMessage();
        }

        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", Map.of("deletedCount", deletedCount));

        return ResponseEntity
                .status(status == 1 ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
                .body(resultMap);
    }
}
