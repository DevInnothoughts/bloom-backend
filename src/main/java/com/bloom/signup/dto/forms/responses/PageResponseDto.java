package com.bloom.signup.dto.forms.responses;

import com.bloom.signup.dto.QuestionResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResponseDto {
    private List<Map<String,String>> data;
    private Integer totalPages;
    private Long totalResponses;
    private Map<String,String> questionIdMap;
}
