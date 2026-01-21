package com.itwill.category.dto;

import com.itwill.category.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CategoryTreeDto {

    private Long categoryId;
    private String nameKey;
    private List<ChildCategoryDto> children;

    public static CategoryTreeDto from(Category parent, List<Category> children) {
        return new CategoryTreeDto(
                parent.getCategoryId(),
                parent.getNameKey(),
                children.stream()
                        .map(c -> new ChildCategoryDto(
                                c.getCategoryId(),
                                c.getNameKey()
                        ))
                        .toList()
        );
    }
}
