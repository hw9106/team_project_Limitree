package com.itwill.product.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.itwill.product.dto.BulkCreateResultDto;
import com.itwill.product.dto.ProductDto;
import com.itwill.product.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/product")
@CrossOrigin(origins = {"http://localhost:3000", "http://172.21.48.1:3000"},
		allowCredentials = "true")
public class AdminProductController {

	private final ProductService productService;

	/*
	 * ADMIN 상품 리스트 불러오기
	 */
	@Operation(summary = "어드민 상품리스트")
	@GetMapping("/list")
	public ResponseEntity<Map<String, Object>> adminProductList() {
		Map<String, Object> resultMap = new HashMap<>();
		int status;
		String msg;
		List<ProductDto> data = new ArrayList<>();

		try {
			List<ProductDto> productList = productService.getAllProducts();
			status = 1;
			msg = "상품 리스트 조회성공";
			data = productList;
		} catch (Exception e) {
			e.printStackTrace();
			status = 2;
			msg = "상품 리스트 조회실패";
		}

		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", data);
		return ResponseEntity.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8").body(resultMap);
	}

	/*
	 * 상품 전체삭제
	 */
	@Operation(summary = "어드민 상품전체삭제")
	@DeleteMapping("/deleteAll")
	public ResponseEntity<Map<String, Object>> deleteAll() {
		Map<String, Object> resultMap = new HashMap<>();
		int status;
		String msg;
		long count;

		try {
			long countAll = productService.deleteAll();
			status = 1;
			msg = "상품 전체삭제 성공!";
			count = countAll;
		} catch (Exception e) {
			e.printStackTrace();
			status = 2;
			msg = "상품 전체삭제 살패";
			count = 0;
		}

		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("count", count);
		return ResponseEntity.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8").body(resultMap);
	}

	@Operation(summary = "어드민 상품 엑셀 일괄 등록")
	@PostMapping("/bulk-create")
	public ResponseEntity<Map<String, Object>> bulkCreate(
			@RequestBody List<ProductDto> productDtoList) {

		Map<String, Object> resultMap = new HashMap<>();
		int status;
		String msg;

		if (productDtoList == null || productDtoList.isEmpty()) {
			resultMap.put("status", 2);
			resultMap.put("msg", "요청 데이터가 비어있습니다.");
			resultMap.put("data", List.of());
			resultMap.put("errors", List.of());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8").body(resultMap);
		}

		try {
			BulkCreateResultDto bulkResult = productService.bulkCreateProducts(productDtoList);

			status = 1;
			msg = "엑셀 일괄 등록 처리 완료";

			resultMap.put("status", status);
			resultMap.put("msg", msg);
			resultMap.put("successCount", bulkResult.getSuccessCount());
			resultMap.put("failCount", bulkResult.getFailCount());
			resultMap.put("data", bulkResult.getSuccessSkus());
			resultMap.put("errors", bulkResult.getErrors());

			return ResponseEntity.status(HttpStatus.OK)
					.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8").body(resultMap);

		} catch (Exception e) {
			e.printStackTrace();
			status = 2;
			msg = "엑셀 일괄 등록 실패";

			resultMap.put("status", status);
			resultMap.put("msg", msg);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8").body(resultMap);
		}
	}

}
