package com.itwill.category;

import com.itwill.category.dto.CategoryTreeDto;
import com.itwill.category.entity.Category;
import com.itwill.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryTreeDto> getCategoryTree() {

        List<Category> parents =
                categoryRepository.findByParentIsNullAndUseYnOrderBySortOrder("Y");

        return parents.stream()
                .map(parent -> {
                    List<Category> children =
                            categoryRepository.findByParentCategoryIdAndUseYnOrderBySortOrder(
                                    parent.getCategoryId(), "Y");

                    return CategoryTreeDto.from(parent, children);
                })
                .toList();
    }

}
