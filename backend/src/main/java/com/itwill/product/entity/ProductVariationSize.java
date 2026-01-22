package com.itwill.product.entity;

import com.itwill.product.dto.Size;

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

@Entity
@Table(name = "product_variation_size")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ProductVariationSize {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_variation_size_seq")
    @SequenceGenerator(name = "product_variation_size_seq", sequenceName = "PRODUCT_VARIATION_SIZE_SEQ", allocationSize = 1)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "p_variation_id")
    private ProductVariation productVariation;

    private String name; // "x" , "m" , "xl", "xxl"
    private Integer stock;



    public Size toDto(){
        return Size.builder()
                                      .id(id)
                                      .name(name)
                                      .stock(stock)
                                      .build();
    }

}
