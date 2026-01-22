package com.itwill.compare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itwill.compare.dto.CompareDto;
import com.itwill.product.entity.Product;
import com.itwill.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString(exclude = "user")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Compare {
    
    @Id
    @Column(name = "compare_item_id")
    private String compareItemId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="user_id")
    @JsonIgnore // stackOverFlow 방지 
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;


    public static CompareDto toDto(Compare compareEntity){
        return CompareDto.builder()
                         .compareItemId(compareEntity.compareItemId)
                         .userId(compareEntity.getUser().getUserId())
                         .productId(compareEntity.getProduct().getId())
                         .productDto(compareEntity.getProduct().toDto())
                         .build();
    } 

}
