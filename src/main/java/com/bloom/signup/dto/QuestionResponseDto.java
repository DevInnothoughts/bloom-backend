package com.bloom.signup.dto;

import com.bloom.signup.dto.forms.responses.QuestionType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionResponseDto {
    private String questionId;
    private String questionTitle;
    private String questionSubtitle;
    private QuestionType questionType;
    private List<String> responses;
    private String rating;
    @JsonProperty(value = "isUserText",defaultValue = "false")
    private Boolean isUserText;
}
