package com.itwill.product.dto;

import java.util.ArrayList;
import java.util.List;

import com.itwill.product.entity.ProductVariation;
import com.itwill.product.entity.ProductVariationSize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Variation {

    private Long id;

    private String color;
    private String image;

    private List<Size> size = new ArrayList<>();



    public ProductVariation toEntity() {
        ProductVariation pv = ProductVariation.builder().id(id).color(color).image(image).build();

        // ✅ size -> ProductVariationSize 엔티티로 변환해서 붙이기
        List<ProductVariationSize> sizeEntities = new ArrayList<>();

        if (this.size != null && !this.size.isEmpty()) {
            for (Size sDto : this.size) {
                ProductVariationSize pvs = ProductVariationSize.builder().name(sDto.getName())
                        .stock(sDto.getStock()).productVariation(pv) // ⭐ FK 연결(중요)
                        .build();
                sizeEntities.add(pvs);
            }
        }

        pv.setProductVariationSizes(sizeEntities);
        return pv;
    }
}
