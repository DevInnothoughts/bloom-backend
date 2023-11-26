package com.bloom.signup.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignupDto {
    private String mobileNumber;
    private String businessName;
    private String businessLink;
    private String userName;
    private String emailId;
}
