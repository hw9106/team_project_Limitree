package com.itwill.product.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkCreateErrorDto {
  private int index;
  private String sku;
  private String message;
}
