package com.itwill.compare.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itwill.compare.dto.CompareDto;
import com.itwill.compare.service.CompareService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/compare")
@CrossOrigin(origins = {"http://localhost:3000",
                        "http://172.21.48.1:3000"
},allowCredentials = "true")
public class CompareController {

    private final CompareService compareService;

    @Operation(summary = "비교목록에 상품 추가")
    @PostMapping("/add")
    public ResponseEntity<Map<String,Object>> addToCompare(@RequestBody CompareDto compareDto)throws Exception{
        Map<String, Object> resultMap = new HashMap<>();
		int status ;
		String msg ;
        String data;

        try{
            data = compareService.addToCompare(compareDto);
            status = 1;
            msg ="비교목록 상품추가 성공!";
        }catch(Exception e){
            e.printStackTrace();
            status=2;
            msg="비교목록 상품추가 실패";
            data =null;
        }
        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);

        return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
    }
    @Operation(summary = "특정 사용자의 비교목록 조회")
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String,Object>> getCompareListByUserId(
        @Parameter(name = "userId",description = "사용자 ID",required = true)
        @PathVariable("userId") String userId)throws Exception{
        Map<String, Object> resultMap = new HashMap<>();
		int status ;
		String msg ;
        List<CompareDto> data;
        try {
            List<CompareDto> compareList = compareService.getCompareListByUserId(userId);
            status =1;
            msg ="특정 사용자의 비교목록 조회 성공!";
            data = compareList;
        } catch (Exception e) {
            status=2;
            msg="특정 사용자의 비교목록 조회 실패";
            data = null;
        }
        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);

         return ResponseEntity
				.status(HttpStatus.OK)
				.header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
				.body(resultMap);
    }

    @Operation(summary = "비교목록에서 단일상품 삭제")
    @DeleteMapping("/delete/{compareItemId}")
    public ResponseEntity<Map<String,Object>> deleteFromCompare(@Parameter(name = "compareItemId",description = "비교 아이템 ID",required = true)
                                                                @PathVariable("compareItemId") String compareItemId)throws Exception{
        Map<String, Object> resultMap = new HashMap<>();
        int status;
        String msg;
        int data;

        try {
            data=compareService.deleteFromCompare(compareItemId);
            status=1;
            msg="비교목록 단일상품 삭제성공!";
        } catch (Exception e) {
             e.printStackTrace();
            status = 2;
            msg = "비교목록 상품 삭제 실패";
            data = 0;
        }
        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);

        return ResponseEntity
            .status(HttpStatus.OK)
            .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
            .body(resultMap); 
                                                            
                                                                }

   @Operation(summary = "사용자의 비교목록 전체 삭제")                                                             
   @DeleteMapping("/user/{userId}")
   public ResponseEntity <Map<String,Object>> delteAllByUserId(@Parameter(name = "userId",description = "사용자 ID",required = true)
                                                                @PathVariable("userId") String userId)throws Exception{

       Map<String, Object> resultMap = new HashMap<>();
        int status;
        String msg;
        int data;

        try {
            data=compareService.deleteAllByUserId(userId);
            status=1;
            msg="비교목록 전체삭제 성공!";
        } catch (Exception e) {
            e.printStackTrace();
            data=0;
            status=2;
            msg="비교목록 전체삭제 실패";
        }
        resultMap.put("status", status);
        resultMap.put("msg", msg);
        resultMap.put("data", data);
        
        return ResponseEntity
            .status(HttpStatus.OK)
            .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
            .body(resultMap); 
    }
    
    @Operation(summary = "비교목록에 상품존재 여부확인")
    @GetMapping("/check/{userId}/{productId}")
    public ResponseEntity<Map<String,Object>> isProductInCompare(@Parameter(name = "userId",description = "사용자 아이디",required = true)
                                                                @PathVariable("userId")String userId,
                                                                @Parameter(name = "productId",description = "상품 아이디",required = true)
                                                                @PathVariable("productId")Long productId)throws Exception{

    Map<String, Object> resultMap = new HashMap<>();
    int status;
    String msg;
    boolean data;                                                         

    try{
        data = compareService.isProductInCompare(userId, productId);
        status=1;
        msg="중복 체크 성공!";
    }catch(Exception e){
        e.printStackTrace();
        status=2;
        msg="중복 체크 실패";
        data=false;
    }
    resultMap.put("data", data);
    resultMap.put("status", status);
    resultMap.put("msg", msg);

     return ResponseEntity
            .status(HttpStatus.OK)
            .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
            .body(resultMap); 

  }
  @Operation(summary = "사용자의 비교목록 개수 조회")
  @GetMapping("/count/{userId}")
  public ResponseEntity<Map<String,Object>> getCompareCount(@Parameter(name = "userId",description = "사용자 아이디",required = true)
                                                            @PathVariable("userId") String userId)throws Exception{

    Map<String, Object> resultMap = new HashMap<>();
    int status;
    String msg;
    int data;
    
    try {
        data = compareService.getCompareCount(userId);
        status=1;
        msg="비교목록 개수조회 성공!";
    } catch (Exception e) {
        e.printStackTrace();
        data = 0;
        status=2;
        msg="비교목록 개수조회 실패";
    }
    resultMap.put("status", status);
    resultMap.put("msg", msg);
    resultMap.put("data", data);
    
     return ResponseEntity
            .status(HttpStatus.OK)
            .header(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8")
            .body(resultMap);

}
}
