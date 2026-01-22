package com.itwill.wishlist;

import java.util.List;

import com.itwill.cart.dto.CartDtoSingle;
import com.itwill.cart.entity.Cart;
import com.itwill.user.entity.User;
import com.itwill.wishlist.dto.WishlistDto;
import com.itwill.wishlist.entity.Wishlist;

import jakarta.transaction.Transactional;

@Transactional
public interface WishlistService {
    /*
	 * cartDtoSingle 저장/수정
	 */	
    Long wishlistWrite(WishlistDto wishlistDto) throws Exception;
	

	/*
		User로 wishlist  가져옴
	 */ 
    public List <WishlistDto> wishlistList(User user) throws Exception;

    /*
	 * cartItemId로삭제
	 */ 
	int wishlistDeleteWishlistId(Wishlist wishlist) throws Exception;
    /*
	 * userId로삭제
	 */
	int wishlistDeleteUser(User user) throws Exception;   
	 
}
