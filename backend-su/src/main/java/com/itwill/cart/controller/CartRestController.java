package com.itwill.cart.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;

import com.itwill.cart.CartService;
import com.itwill.cart.dto.CartDtoSingle;
import com.itwill.cart.entity.Cart;
import com.itwill.user.entity.User;



@RestController
public class CartRestController {
    @Autowired
    private CartService cartService;

	@Operation(summary = "카트 쓰기")
	@PostMapping(value="/cart")
	public ResponseEntity<Map<String, Object>> cart_write_action(@RequestBody CartDtoSingle cartDtoSingle) throws Exception{
		
		//System.out.println("############################# cartDtoSingle.getCartItemId()    -- " + cartDtoSingle.getCartItemId());
		String cartItemId = cartService.cartWriteSingle(cartDtoSingle);
		//System.out.println("############################# test    -- " + cartItemId);

		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		String data = cartItemId;
		String msg = "성공";

		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", cartItemId);
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}

	@Operation(summary = "카트리스트", description = "카트전체를 조회합니다")
	@GetMapping(value = "/carts/{userId}")
	public ResponseEntity<Map<String, Object>> cart_list(@PathVariable(value = "userId") String userId) throws Exception {
        User user = User.builder()
                    .userId(userId)
                    .build();		
		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		String msg = "성공";
		//CartDtoMulti data = cartService.cartList(user); 
		List <CartDtoSingle> data = cartService.cartList(user);
		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", data);

		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}	

	@Operation(summary = "카트 아이템 한개 삭제")
	@DeleteMapping(value = "/cart/{cartItemId}")
	public ResponseEntity<Map<String, Object>> cart_delete_cartItemId(@PathVariable("cartItemId") String cartItemId) throws Exception{
		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		String msg = "성공";
		/******************************************/
		//System.out.println("########### cart_delete_cartItemId cartItemId : " + cartItemId);
		//cartService.cartDeleteCartItemId(cartItemId);
 
		Cart cart = Cart.builder()
					.cartItemId(cartItemId)
					.build();
		cartService.cartDeleteCartItemId(cart);
		status=1;
		msg="";
		/******************************************/
		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", cartItemId);
		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}

	@Operation(summary = "카트 아이템 전체 삭제")
	@DeleteMapping(value = "/carts/{userId}")
	public ResponseEntity<Map<String, Object>> cart_delete_user(@PathVariable("userId") String userId) throws Exception{
        User user = User.builder()
                    .userId(userId)
                    .build();	

		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		String msg = "성공";
		/******************************************/
		//System.out.println("########### cart_delete_user cartItemId : " + userId);
		cartService.cartDeleteUser(user);
		status=1;
		msg="";
		/******************************************/
		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", userId);
		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}

	@Operation(summary = "카트 수정", description = "카트 수량 수정")
	@PutMapping(value = "/cart")
	public ResponseEntity<Map<String, Object>> cart_modify_action(@RequestBody CartDtoSingle cartDtoSingle) {
		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		String msg = "성공";
		String data = null;
		try {

			String cartItemId = cartService.cartWriteSingle(cartDtoSingle);
			status=1;
			msg="수정성공";
			data = cartItemId;
		} catch (Exception e) {
			e.printStackTrace();
			status=2;
			msg="수정실패";
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
