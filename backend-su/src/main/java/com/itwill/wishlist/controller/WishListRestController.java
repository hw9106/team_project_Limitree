package com.itwill.wishlist.controller;

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

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;

import com.itwill.cart.dto.CartDtoSingle;
import com.itwill.cart.entity.Cart;
import com.itwill.product.entity.Product;
import com.itwill.user.entity.User;
import com.itwill.wishlist.WishlistService;
import com.itwill.wishlist.dto.WishlistDto;
import com.itwill.wishlist.entity.Wishlist;




@RestController
public class WishListRestController {
    @Autowired
    private WishlistService wishlistService;

	@Operation(summary = "WisjList 쓰기")
	@PostMapping(value="/wishlist")
	public ResponseEntity<Map<String, Object>> cart_write_action(@RequestBody WishlistDto wishlistDto) throws Exception{
		Long wishlistId = wishlistService.wishlistWrite(wishlistDto);
		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		Long data = wishlistId;
		String msg = "성공";

		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", wishlistId);
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}


	@Operation(summary = "WishList 리스트", description = "WishList 전체를 조회합니다")
	@GetMapping(value = "/wishlist/{userId}")
	public ResponseEntity<Map<String, Object>> cart_list(@PathVariable(value = "userId") String userId) throws Exception {
        User user = User.builder()
                    .userId(userId)
                    .build();		
		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		String msg = "성공";

		List <WishlistDto> data = wishlistService.wishlistList(user);
		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", data);

		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}	
	
	@Operation(summary = "WishList 아이템 한개 삭제")
	@DeleteMapping(value = "/wishlist/{wishlistId}")
	public ResponseEntity<Map<String, Object>> wishlist_delete_wishlistId(@PathVariable("wishlistId") String wishlistId) throws Exception{
		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		String msg = "성공";
		Wishlist wishlist = Wishlist.builder()
					.wishlistId(Long.parseLong(wishlistId))
					.build();

		wishlistService.wishlistDeleteWishlistId(wishlist);
		status=1;
		msg="";
		/******************************************/
		resultMap.put("status", status);
		resultMap.put("msg", msg);
		resultMap.put("data", wishlistId);
		return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
	}	



	@Operation(summary = "WishList 아이템 전체 삭제")
	@DeleteMapping(value = "/wishlists/{userId}")
	public ResponseEntity<Map<String, Object>> cart_delete_user(@PathVariable("userId") String userId) throws Exception{
        User user = User.builder()
                    .userId(userId)
                    .build();	

		Map<String, Object> resultMap = new HashMap<>();
		int status = 1;
		String msg = "성공";
		/******************************************/
		//System.out.println("########### cart_delete_user cartItemId : " + userId);
		wishlistService.wishlistDeleteUser(user);
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

}
