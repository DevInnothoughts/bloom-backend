package com.bloom.signup.dto.forms.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyFormResponseDto {
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String formId;
    private Integer noOfQuestions;
    private Long totalResponses;
}
