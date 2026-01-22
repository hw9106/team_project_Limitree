package com.itwill.compare.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.itwill.compare.dto.CompareDto;

@SpringBootTest
public class CompareServiceTest {

    @Autowired
    private CompareService compareService;

    @Test
    void addToCompareTest() throws Exception{
        CompareDto dto = new CompareDto();
        dto.setUserId("test11234");
        dto.setProductId(1L);

        String result = compareService.addToCompare(dto);

        assertEquals(1, result);
    }

}
