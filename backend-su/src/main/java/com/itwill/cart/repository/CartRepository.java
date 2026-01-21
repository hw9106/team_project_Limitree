package com.itwill.cart.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itwill.cart.entity.Cart;
import com.itwill.user.entity.User;

public interface CartRepository extends  JpaRepository<Cart,String> {
    List<Cart> findByUser(User user);
    void deleteByCartItemId(String cartItemId);
    void deleteByCartItemId(Cart cart);
    void deleteByUser(User user);
}
