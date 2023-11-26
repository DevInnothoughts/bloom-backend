package com.bloom.signup.feign;

import com.bloom.signup.dto.GptDto;
import com.bloom.signup.dto.GptResponseDto;
import feign.Headers;
import feign.Param;
import feign.RequestLine;

public interface ChatgptClient {
    String apiEP = "https://api.openai.com/v1/chat";

    @RequestLine("POST /completions")
    @Headers({"Content-Type: application/json","Authorization: {token}"})
    GptResponseDto getReview(@Param("token")String token, GptDto gptDto);
}
