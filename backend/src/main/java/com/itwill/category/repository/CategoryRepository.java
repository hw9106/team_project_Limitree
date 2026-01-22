package com.itwill.category.repository;

import com.itwill.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParentIsNullAndUseYnOrderBySortOrder(String useYn);
    List<Category> findByParentCategoryIdAndUseYnOrderBySortOrder(Long parentId, String useYn);
}
