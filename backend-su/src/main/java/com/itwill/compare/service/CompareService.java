package com.itwill.compare.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itwill.compare.dto.CompareDto;
import com.itwill.compare.entity.Compare;
import com.itwill.compare.repository.CompareRepository;
import com.itwill.product.entity.Product;
import com.itwill.product.repository.ProductRepository;
import com.itwill.user.entity.User;
import com.itwill.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional // ****추후에 필요한 메서들에 별도로 뿌리자! *******
public class CompareService {

    private final CompareRepository compareRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository; 
    

    // private static final Logger log = LoggerFactory.getLogger(CompareService.class);

    private static final int MAX_COMPARE_ITEMS = 4;


    /*
        비교 목록에 상품 추가
    */
    public String addToCompare(CompareDto compareDto) throws Exception{

        User user =userRepository.findById(compareDto.getUserId()).orElseThrow(()->new RuntimeException("존재하지 않는 회원입니다."));
        Product product = productRepository.findById(compareDto.getProductId()).orElseThrow(()->new RuntimeException("존재하지 않는 상품입니다."));

        try{
            // 중복 체크
            if (compareRepository.existsByUserUserIdAndProductId(compareDto.getUserId(), compareDto.getProductId())) {
                return null; // 이미 존재
            }
            //최대 개수 체크
            if (!canAddMore(compareDto.getUserId())) {
                return null; // 가득참
            }
            //UUID 생성
            if (compareDto.getCompareItemId() == null || compareDto.getCompareItemId().isBlank()) {
                compareDto.setCompareItemId(UUID.randomUUID().toString());
            }
            //Entity 변환 및 저장
            Compare compare = CompareDto.toEntity(compareDto);
            compareRepository.save(compare);
            return compareDto.getCompareItemId(); // UUID 반환 
    }catch(Exception e){
        e.printStackTrace();
        return null;
    }
    }
    /*
        특정 사용자의 비교 목록 조회
    */
   public List<CompareDto> getCompareListByUserId(String userId)throws Exception{
        
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException(userId+"회원 정보는 존재하지 않습니다."));
        List<Compare> compareList = compareRepository.findByUserUserId(user.getUserId());

        return compareList.stream()
                          .map(compare -> {
                            CompareDto dto = new CompareDto();
                            dto.setCompareItemId(compare.getCompareItemId());
                            dto.setUserId(compare.getUser().getUserId());
                            dto.setProductId(compare.getProduct().getId());
                            //Product 정보 포함
                            dto.setProductDto(compare.getProduct().toDto());
                            return dto;
                          })
                          .collect(Collectors.toList());
   }

   /*
    비교 목록에서 단일 상품 삭제
   */
  public int deleteFromCompare(String compareItemId) throws Exception{
    try{
        compareRepository.deleteById(compareItemId);
        return 1;
    }catch(Exception e){
        e.printStackTrace();
        return 0;
    }
  }

  /*
    사용자의 비교 목록 전체 삭제
  */
 public int deleteAllByUserId(String userId)throws Exception{
    try{
        compareRepository.deleteAllByUserUserId(userId);
        return 1;
    }catch(Exception e){
        e.printStackTrace();
        return 0;
    }
 }

 /*
    중복 체크(비교 목록에 이미 있는 상품인지)
 */
 public boolean isProductInCompare(String userId,Long productId)throws Exception{
    return compareRepository.existsByUserUserIdAndProductId(userId, productId);
 }

 /*
    비교목록 개수 조회
 */
 public int getCompareCount(String userId) throws Exception{
    return compareRepository.countByUserUserId(userId);
 }




    public boolean canAddMore(String userId)throws Exception{
        int currentCount = compareRepository.countByUserUserId(userId);
        return currentCount < MAX_COMPARE_ITEMS;
    }

}
