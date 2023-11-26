package com.bloom.signup.service;

import com.bloom.signup.dto.*;
import com.bloom.signup.feign.ChatgptClient;
import com.bloom.signup.repo.ResponseRepo;
import com.bloom.signup.utils.Prompts;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@Slf4j
public class GptService {
    @Autowired
    private ChatgptClient chatgptClient;

    @Autowired
    private ResponseRepo responseRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @SneakyThrows
    @Async
    public void getReview(String formId){
        try {
            val storedResp = responseRepo.findByResponseId(formId);
            val responses = objectMapper.readValue(storedResp.getReview(), ResponseDto.class);
            val gptCtx = GptContext.builder();
            val userPrompt = GptMessageDto.builder()
                    .role("user")
                    .content(Prompts.convertToPrompt(responses))
                    .build();
            val systemPrompt = GptMessageDto.builder()
                    .role("system")
                    .content(Prompts.companyPrompts.get(responses.getCompanyName()))
                    .build();
            val gptDto = GptDto.builder()
                    .model("gpt-3.5-turbo")
                    .messages(Arrays.asList(systemPrompt, userPrompt))
                    .build();
            gptCtx.req(gptDto);
            log.info("Gpt dto: {}",gptDto);
            val response = chatgptClient.getReview("Bearer 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", gptDto);
            log.info("Got raw response: {}",response);
            gptCtx.resp(response);
            storedResp.setResponse(objectMapper.writeValueAsBytes(gptCtx.build()));
            responseRepo.save(storedResp);
        }catch (Exception e){
            log.error("Failed review",e);
        }
    }
}
