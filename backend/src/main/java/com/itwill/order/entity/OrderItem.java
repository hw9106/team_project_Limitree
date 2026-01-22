package com.itwill.order.entity;

import java.math.BigDecimal;

import com.itwill.product.entity.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity  // ProductVariation 패턴
@Table(name = "order_items")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = {"order", "product"})  // Compare 패턴 (순환 참조 방지)
public class OrderItem {

    @Id  // ProductVariation 패턴 (SEQUENCE)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_item_seq")
    @SequenceGenerator(name = "order_item_seq", sequenceName = "ORDER_ITEM_SEQ", allocationSize = 1)
    @Column(name = "order_item_id")
    private Long orderItemId;

    // Order와의 관계 (ProductVariation의 product 패턴)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Product와의 관계 (Cart의 product 패턴)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Cart 패턴 따라감
    @Column(nullable = false)
    private Integer quantity;

    // OrderItem만의 추가 필드! (주문 당시 가격 저장)
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    // Cart 패턴 따라감
    @Column(name = "selected_product_color", length = 50)
    private String selectedProductColor;

    @Column(name = "selected_product_size", length = 50)
    private String selectedProductSize;
}