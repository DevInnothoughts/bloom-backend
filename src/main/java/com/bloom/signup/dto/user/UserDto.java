package com.bloom.signup.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private String userId;
    private String emailId;
    private String companyId;
    private CompanyLogo companyLogo;
    private String companyName;
}
