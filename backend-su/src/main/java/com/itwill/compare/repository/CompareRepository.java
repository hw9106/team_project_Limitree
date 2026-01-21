package com.itwill.compare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.itwill.compare.entity.Compare;

@Repository
public interface CompareRepository extends JpaRepository<Compare,String> {

    //userId로 모든 비교 목록 조회
    List<Compare> findByUserUserId(String userId);

    //userId로 모든 비교 목록 삭제
    @Transactional
    void deleteAllByUserUserId(String userId);

    //userId 와 productId로 존재 여부 확인
    boolean existsByUserUserIdAndProductId(String userId,Long productId);

    //userId로 비교목록 개수 조회
    int countByUserUserId(String userId);

    //userId 와 productId로 조회 (필요시)
    Optional<Compare> findByUserUserIdAndProductId(String userId, Long productId);
}
