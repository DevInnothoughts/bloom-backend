package com.bloom.signup.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class GptResponseDto {
    private String id;
    private String model;
    private String created;
    private List<GptMessageResposneDto> choices;
    private GptUsageDto usage;
}
