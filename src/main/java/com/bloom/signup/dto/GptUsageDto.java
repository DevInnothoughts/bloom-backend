package com.bloom.signup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GptUsageDto {
    private String prompt_tokens;
    private String completion_tokens;
    private String total_tokens;
}
