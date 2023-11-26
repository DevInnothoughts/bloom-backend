package com.bloom.signup.dto.forms;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class FormSummaryDto {
    private String aboutForm;
    private Map<String,Object> businessMetaData;
    private String formName;
}
