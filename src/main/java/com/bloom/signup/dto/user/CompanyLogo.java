package com.bloom.signup.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyLogo {
    private String imageUrl;
    private Double imageHeight;
    private Double imageWidth;
    private Double logoScalingFactor;
}
