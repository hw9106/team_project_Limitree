package com.itwill.cart;

import java.util.List;

import com.itwill.cart.dto.CartDtoSingle;
import com.itwill.cart.entity.Cart;
import com.itwill.user.entity.User;

import jakarta.transaction.Transactional;

@Transactional
public interface CartService {
    /*
	 * cartDtoSingle 저장/수정
	 */	
    String cartWriteSingle(CartDtoSingle cartDto) throws Exception;

	/*
		User로 cartList  가져옴
	*/
    public List <CartDtoSingle> cartList(User user) throws Exception;

    /*
	 * cartItemId로삭제
	 */
	int cartDeleteCartItemId(String cartItemId) throws Exception;
	int cartDeleteCartItemId(Cart cart) throws Exception;
    /*
	 * userId로삭제
	 */
	int cartDeleteUser(User user) throws Exception;    
}
