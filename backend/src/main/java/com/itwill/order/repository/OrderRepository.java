package com.itwill.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.itwill.order.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Modifying
    @Query("delete from Order o")
    int deleteAllOrders();
    List<Order> findByUser_UserIdOrderByOrderDateDesc(String userId);
}