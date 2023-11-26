package com.bloom.signup.dto.forms;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ThemeDto {
    private String primaryBrandColor;
    private String secondaryBrandColor;
    private String mainBackgroundColor;
    private String containerBackgroundColor;
    private String borderColor;
    private String formInputError;
}
