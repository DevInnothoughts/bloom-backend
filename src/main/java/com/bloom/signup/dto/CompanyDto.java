package com.bloom.signup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyDto {
    private String companyName;
    private double logoScalingFactor;
    private String imageUrl;
    private Double imageHeight;
    private Double imageWidth;
}
