package com.itwill.product.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itwill.cart.entity.Cart;
import com.itwill.compare.entity.Compare;
import com.itwill.product.dto.ProductDto;
import com.itwill.product.dto.Size;
import com.itwill.product.dto.Variation;
import com.itwill.wishlist.entity.Wishlist;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @SequenceGenerator(name = "product_seq", sequenceName = "PRODUCT_SEQ", allocationSize = 1)
    private Long id;

    @Column(unique = true, length = 50)
    private String sku; // 상품 고유 식별 코드 (ex> 'asdf123') 그렇기 때문에 수정x

    @Column(nullable = false, length = 200)
    private String name;

    @Column(precision = 10, scale = 2) // 전체 자릿수 10, 소수점 자리 2까지.
    private BigDecimal price = BigDecimal.ZERO; // default 값 = 0원

    private Integer discount;

    @Column(name = "offer_end")
    private String offerEnd;

    @Column(name = "new")
    private Boolean isNew;

    private Integer rating; // (별점 수정 x)

    @Column(name = "sale_count")
    private Integer saleCount; // 판매 수량 (수정x)

    @Column(length = 500)
    private String category; // DB에는 "의류,티셔츠" 같이 문자열로 저장

    @Column(length = 500)
    private String tag; // dto 에서 List<String> 으로 변환.

    private Integer stock;

    @Column(length = 2000)
    private String image; // dto 에서 List<String> 으로 변환.

    @Column(name = "short_description", length = 1500)
    private String shortDescription;

    @Column(name = "full_description", length = 3500)
    private String fullDescription;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariation> productVariations = new ArrayList<>();

    // 카트와 조인 걸음
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Cart> cart = new ArrayList<>();

    // Wishlist와 조인 걸음
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Wishlist> wishlist = new ArrayList<>();

    // Compare 조인 걸음
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Compare> compare = new ArrayList<>();


    // (추가) category 한글 -> "키"로 변환
    // 1안 시작 버전: DB는 한국어여도, 응답은 키로 내려가게 함
    private String categoryKoToKey(String ko) {
        if (ko == null)
            return null;

        return switch (ko.trim()) {
            case "의류" -> "CLOTHES";
            case "상의" -> "TOP";
            case "티셔츠" -> "TSHIRT";
            case "하의" -> "BOTTOM";
            case "청바지" -> "JEANS";
            case "니트" -> "KNIT";
            case "후드" -> "HOOD";
            case "셔츠" -> "SHIRT";
            case "조거팬츠" -> "JOGGER_PANTS";
            case "카고팬츠" -> "CARGO_PANTS";
            case "아우터" -> "OUTER";
            case "패딩" -> "PADDING";
            case "코트" -> "COAT";
            case "잡화" -> "ACCESSORIES";
            case "벨트" -> "BELT";
            default -> ko.trim(); // 매핑 없으면 그대로 반환(원하면 "UNKNOWN"으로 바꿔도 됨)
        };
    }

    // (추가) DB 문자열 category를 List로 만들면서 "키"로 변환해서 반환
    private List<String> toCategoryKeyList() {
        if (this.category == null || this.category.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(this.category.split(",")).map(String::trim).filter(s -> !s.isEmpty())
                .map(this::categoryKoToKey).collect(Collectors.toList());
    }

    public ProductDto toDto() {
        return ProductDto.builder().id(id).sku(sku).name(name).price(price).discount(discount)
                .offerEnd(offerEnd).isNew(isNew).rating(rating).saleCount(saleCount)

                // 기존: Arrays.asList(category.split(","))
                // 변경: 키로 변환해서 내려감
                .category(toCategoryKeyList())

                .tag(tag != null && !tag.isEmpty() ? Arrays.asList(tag.split(","))
                        : new ArrayList<>())
                .stock(stock)
                .image(image != null && !image.isEmpty() ? Arrays.asList(image.split(","))
                        : new ArrayList<>())
                .shortDescription(shortDescription).fullDescription(fullDescription)
                .variation(productVariations.stream().map(pv -> pv.toDto()) // ProductVariation ->
                                                                            // Variation(DTO)으로 변환
                        .collect(Collectors.toList()))
                .build();
    }

    public void addVariation(ProductVariation pv) {
        this.productVariations.add(pv);
        pv.setProduct(this);
    }

    public void update(ProductDto dto) {
        if (dto.getName() != null)
            this.name = dto.getName();
        if (dto.getPrice() != null)
            this.price = dto.getPrice();
        if (dto.getDiscount() != null)
            this.discount = dto.getDiscount();
        if (dto.getOfferEnd() != null)
            this.offerEnd = dto.getOfferEnd();
        if (dto.getIsNew() != null)
            this.isNew = dto.getIsNew();
        if (dto.getStock() != null)
            this.stock = dto.getStock();

        // 여기(update)는 “저장” 로직이야.
        // 1안 정석은 DB에도 키를 저장하는 거지만,
        // 지금은 "응답만 키"로 바꾸는 단계이므로 우선 그대로 둬도 됨.
        if (dto.getCategory() != null)
            this.category = String.join(",", dto.getCategory());

        if (dto.getTag() != null)
            this.tag = String.join(",", dto.getTag());
        if (dto.getImage() != null)
            this.image = String.join(",", dto.getImage());
        if (dto.getShortDescription() != null)
            this.shortDescription = dto.getShortDescription();
        if (dto.getFullDescription() != null)
            this.fullDescription = dto.getFullDescription();

        if (dto.getVariation() != null) {
            this.productVariations.clear(); // 기존 variation 전체 삭제
            for (Variation varDto : dto.getVariation()) {
                ProductVariation pv = varDto.toEntity();
                pv.setId(null); // 새 엔티티 만들기
                pv.setProduct(this); // 양방향 연관관계 설정

                if (pv.getProductVariationSizes() != null) {
                    for (Size sizeDto : varDto.getSize()) {
                        ProductVariationSize pvs = sizeDto.toEntity();
                        pvs.setId(null);
                        pvs.setProductVariation(pv); // 양방향 연관관계 설정
                    }
                }
                
                this.productVariations.add(pv);
            }
        }
    }
}
