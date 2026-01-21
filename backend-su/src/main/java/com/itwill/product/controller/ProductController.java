package com.itwill.product.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itwill.product.dto.ProductDto;
import com.itwill.product.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product")
@CrossOrigin(origins = { "http://localhost:3000",
		"http://172.21.48.1:3000"
}, allowCredentials = "true")
public class ProductController {

	private final ProductService productService;

	@Operation(summary = "전체 상품 목록 조회")
	@GetMapping("/list")
	public ResponseEntity<Map<String, Object>> productList() {
		Map<String, Object> resultMap = new HashMap<>();
		int status;
		String msg;
		List<ProductDto> data = new ArrayList<ProductDto>();

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
		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);

	}

	@Operation(summary = "상품 ID로 조회")
	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> productDetail(@PathVariable("id") Long id) {
		Map<String, Object> resultMap = new HashMap<>();
		int status;
		String msg;
		ProductDto data = null;

		try {
			data = productService.getProductById(id);
			status = 1;
			msg = "상품 조회성공!";
		} catch (Exception e) {
			System.err.println("========== 에러 발생! ID: " + id + " ==========");
			e.printStackTrace();
			status = 2;
			msg = "상품 조회실패: " + e.getMessage(); // ← 에러 메시지 포함
		}
		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", data);

		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}

	@Operation(summary = "상품 등록")
	@PostMapping("/create")
	public ResponseEntity<Map<String, Object>> productCreate(@RequestBody ProductDto productDto) {
		Map<String, Object> resultMap = new HashMap<>();
		int status;
		String msg;
		ProductDto data = null;

		try {
			data = productService.createProduct(productDto);
			status = 1;
			msg = "상품 등록성공!";
		} catch (Exception e) {
			e.printStackTrace();
			status = 2;
			msg = "상품 등록실패";
		}
		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", data);

		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}

	@Operation(summary = "상품 삭제")
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Map<String, Object>> productDelete(@PathVariable("id") Long id) {
		Map<String, Object> resultMap = new HashMap<>();
		int status;
		String msg;

		try {
			productService.deleteById(id);
			status = 1;
			msg = "상품 삭제성공!";
		} catch (Exception e) {
			e.printStackTrace();
			status = 2;
			msg = "상품 삭제실패";
		}
		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", null);

		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}

	@Operation(summary = "상품 수정")
	@PutMapping("/update/{id}")
	public ResponseEntity<Map<String, Object>> productUpdate(@PathVariable("id") Long id,
			@RequestBody ProductDto productDto) {
		Map<String, Object> resultMap = new HashMap<>();
		int status;
		String msg;
		ProductDto data = null;

		try {
			data = productService.updateProduct(id, productDto);
			status = 1;
			msg = "상품 수정성공!";
		} catch (Exception e) {
			e.printStackTrace();
			status = 2;
			msg = "상품 수정실패";
		}

		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", data);

		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}
}
