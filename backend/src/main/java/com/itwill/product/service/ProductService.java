package com.itwill.product.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itwill.product.dto.BulkCreateErrorDto;
import com.itwill.product.dto.BulkCreateResultDto;
import com.itwill.product.dto.ProductDto;
import com.itwill.product.dto.Size;
import com.itwill.product.dto.Variation;
import com.itwill.product.entity.Product;
import com.itwill.product.entity.ProductVariation;
import com.itwill.product.entity.ProductVariationSize;
import com.itwill.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    /*
     * ✅ 신규 생성: variation/size까지 "무조건" 저장되게 - 부모(Product) 먼저 save - 그 다음 자식(Variation/Size) add로 붙이기
     * - orphanRemoval/cascade 덕분에 flush 시 INSERT 됨
     */
    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        // 신규 생성용 검증 (SKU 중복 체크 포함)
        productValidationForCreate(productDto);

        // SKU 정규화
        productDto.setSku(normalizeSku(productDto.getSku()));

        Product product = productDto.toEntity();

        attachVariationsAndSizes(product, productDto);
        // 1) Product 저장 (부모 먼저)
        Product savedProduct = productRepository.save(product);

        return savedProduct.toDto();
    }

    /*
     * ✅ bulk: 있으면 update(variation/size 포함), 없으면 create - SKU별로 1개 DTO만 들어온다는 전제(프론트에서 sku 기준 묶기) -
     * 그래도 서버에서 안전하게 "update는 재구성 방식"으로 처리
     */
    @Transactional
    public BulkCreateResultDto bulkCreateProducts(List<ProductDto> dtoList) {

        List<String> successSkus = new ArrayList<>();
        List<BulkCreateErrorDto> errors = new ArrayList<>();

        for (int i = 0; i < dtoList.size(); i++) {
            ProductDto dto = dtoList.get(i);

            // ✅ sku 정규화 (공백/특수공백 방지)
            String sku = normalizeSku(dto.getSku());

            try {
                // ✅ 필수값 체크(공통)
                validateCommon(dto, sku);

                // ✅ dto에도 정규화된 sku를 다시 주입
                dto.setSku(sku);

                // ✅ 있으면 update / 없으면 create
                Product exist = productRepository.findBySku(sku).orElse(null);

                if (exist != null) {
                    // update (variation/size 포함) - "직접 재구성" 방식
                    applyScalarFields(exist, dto);
                    rebuildVariationsAndSizes(exist, dto);
                    productRepository.save(exist);
                } else {
                    // create
                    // bulk에서는 이미 common validation 했으니 create용 검증(중복만)만 추가로 해도 됨
                    productValidationForCreate(dto);
                    Product created = productRepository.save(dto.toEntity());
                    attachVariationsAndSizes(created, dto);
                }

                successSkus.add(sku);

            } catch (Exception e) {
                errors.add(BulkCreateErrorDto.builder().index(i).sku(sku)
                        .message(e.getMessage() == null ? "알 수 없는 오류" : e.getMessage()).build());
            }
        }

        return BulkCreateResultDto.builder().successCount(successSkus.size())
                .failCount(errors.size()).successSkus(successSkus).errors(errors).build();
    }

    // ----------------------------
    // 조회/수정/삭제 (기존 유지)
    // ----------------------------

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        List<ProductDto> productListDto = new ArrayList<>();
        List<Product> productList = productRepository.findAll();
        for (Product product : productList) {
            productListDto.add(product.toDto());
        }
        return productListDto;
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(id + "번호의 해당 상품을 찾을수 없습니다."));
        return product.toDto();
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(id + "번호의 해당 상품을 찾을수 없습니다."));
        product.update(productDto);
        productRepository.flush();
        return product.toDto();
    }

    @Transactional
    public void deleteById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("삭제할 상품의 해당 id가 존재하지 않습니다."));
        productRepository.delete(product);
    }

    @Transactional
    public long deleteAll() {
        long count = productRepository.count();
        productRepository.deleteAll();
        return count;
    }

    // ============================
    // ✅ 내부 유틸/검증
    // ============================

    private String normalizeSku(String sku) {
        if (sku == null)
            return null;
        // 일반 trim + 특수 공백까지 방지(간단 버전)
        return sku.replace('\u00A0', ' ').trim();
    }

    private void validateCommon(ProductDto dto, String sku) {
        if (sku == null || sku.isEmpty()) {
            throw new IllegalArgumentException("SKU는 필수입니다.");
        }
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("상품명(name)은 필수입니다.");
        }
        if (dto.getPrice() == null) {
            throw new IllegalArgumentException("가격(price)은 필수입니다.");
        }
        if (dto.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("가격은 0원 이상이어야 합니다.");
        }
        if (dto.getDiscount() != null && (dto.getDiscount() < 0 || dto.getDiscount() > 100)) {
            throw new IllegalArgumentException("할인율은 0~100 사이여야 합니다.");
        }
    }

    // 신규 생성 시에만 SKU 중복 체크
    private void productValidationForCreate(ProductDto productDto) {
        if (productDto.getName() == null || productDto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("상품명은 필수입니다.");
        }
        if (productDto.getPrice() == null) {
            throw new IllegalArgumentException("가격 입력은 필수입니다.");
        }
        String sku = normalizeSku(productDto.getSku());
        if (sku == null || sku.isEmpty()) {
            throw new IllegalArgumentException("SKU는 필수입니다.");
        }
        if (productRepository.existsBySku(sku)) {
            throw new IllegalArgumentException("이미 존재하는 SKU 입니다: " + sku);
        }
        if (productDto.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("가격은 0원 이상이어야 합니다.");
        }
        if (productDto.getDiscount() != null) {
            if (productDto.getDiscount() < 0 || productDto.getDiscount() > 100) {
                throw new IllegalArgumentException("할인율은 0~100 사이여야 합니다.");
            }
        }
    }

    // DTO -> Product (기본필드만)
    private void applyScalarFields(Product target, ProductDto dto) {
        target.setName(dto.getName());
        target.setPrice(dto.getPrice());
        target.setDiscount(dto.getDiscount());
        target.setOfferEnd(dto.getOfferEnd());
        target.setIsNew(dto.getIsNew());
        target.setRating(dto.getRating());
        target.setSaleCount(dto.getSaleCount());
        target.setStock(dto.getStock());

        if (dto.getCategory() != null)
            target.setCategory(String.join(",", dto.getCategory()));
        if (dto.getTag() != null)
            target.setTag(String.join(",", dto.getTag()));
        if (dto.getImage() != null)
            target.setImage(String.join(",", dto.getImage()));

        target.setShortDescription(dto.getShortDescription());
        target.setFullDescription(dto.getFullDescription());
    }

    // ✅ 신규 생성/업데이트 공통: variation/size add로 붙이기
  private void attachVariationsAndSizes(Product product, ProductDto dto) {
    if (product.getProductVariations() == null) {
        product.setProductVariations(new ArrayList<>());
    }

    if (dto.getVariation() == null || dto.getVariation().isEmpty())
        return;

    for (Variation vDto : dto.getVariation()) {
        ProductVariation pv = vDto.toEntity();  // ← 이미 size 포함됨
        pv.setId(null);
        pv.setProduct(product);
        
        // ✅ size id도 null로 초기화
        if (pv.getProductVariationSizes() != null) {
            for (ProductVariationSize pvs : pv.getProductVariationSizes()) {
                pvs.setId(null);
                pvs.setProductVariation(pv);  // FK 재설정
            }
        }
        
        product.getProductVariations().add(pv);
    }
}

    // ✅ update 전용: 기존 variation/size를 전부 갈아끼우는 방식(가장 확실)
    private void rebuildVariationsAndSizes(Product exist, ProductDto dto) {
        if (exist.getProductVariations() == null) {
            exist.setProductVariations(new ArrayList<>());
        }

        // orphanRemoval=true 라면 clear()로 DB에서도 기존 자식들이 삭제됨
        exist.getProductVariations().clear();

        // 새로 다시 붙이기
        attachVariationsAndSizes(exist, dto);
    }
}
