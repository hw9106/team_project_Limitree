package com.itwill.product.dto;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkCreateResultDto {
  private int successCount;
  private int failCount;
  private List<String> successSkus;
  private List<BulkCreateErrorDto> errors;
}
