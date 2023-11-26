package com.bloom.signup.dto.forms;

import com.bloom.signup.dto.CompanyDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FormResponseDto{
    private String formId;
    private FormSummaryDto formSettings;
    private Map<String,Object> formContent;
    private ThemeDto formTheme;
    private CompanyDto companyDetails;

}
