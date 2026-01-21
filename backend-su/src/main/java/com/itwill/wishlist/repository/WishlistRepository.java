package com.itwill.wishlist.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itwill.user.entity.User;
import com.itwill.wishlist.entity.Wishlist;

public interface WishlistRepository extends  JpaRepository<Wishlist,Long> {
    List<Wishlist> findByUser(User user);
    void deleteByWishlistId(Long wishlistId);
    void deleteByUser(User user);
}
