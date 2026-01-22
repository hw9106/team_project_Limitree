package com.itwill.product.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.itwill.product.dto.Variation;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "product_variation")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ProductVariation {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_variation_seq")
    @SequenceGenerator(name = "product_variation_seq", sequenceName = "PRODUCT_VARIATION_SEQ",
            allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    private String color;
    private String image;


    @OneToMany(mappedBy = "productVariation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariationSize> productVariationSizes = new ArrayList<>();

    public void addSize(ProductVariationSize pvs) {
        this.productVariationSizes.add(pvs);
        pvs.setProductVariation(this);
    }


    public Variation toDto() {
        return Variation.builder().id(id).color(color).image(image).size(
                productVariationSizes.stream().map(pvs -> pvs.toDto()).collect(Collectors.toList()))
                .build();
    }
}
