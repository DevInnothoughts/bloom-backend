package com.bloom.signup.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GptMessageResposneDto {
    private String index;
    private GptRespMessage message;
    private String finish_reason;
}
