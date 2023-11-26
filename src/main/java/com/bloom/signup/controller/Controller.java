package com.bloom.signup.controller;

import com.bloom.signup.ResponseBurp;
import com.bloom.signup.dto.*;
import com.bloom.signup.dto.forms.FormSummaryDto;
import com.bloom.signup.entity.StoredBusiness;
import com.bloom.signup.entity.StoredFormSummary;
import com.bloom.signup.entity.StoredResponses;
import com.bloom.signup.repo.FormSummaryRepo;
import com.bloom.signup.repo.ResponseRepo;
import com.bloom.signup.repo.SignupRepo;
import com.bloom.signup.service.GptService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/v1/api/signup")
@Slf4j
//@CrossOrigin(origins = {"https://bloomapi.in","http://localhost:3000"})
public class Controller {

    @Autowired
    private SignupRepo signupRepo;

    @Autowired
    private ResponseRepo responseRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GptService gptService;

    @Autowired
    private FormSummaryRepo formSummaryRepo;

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v1/mobile")
    public ResponseEntity<ResponseBurp> create(@RequestBody SignupDto signupDto){
        try {
            if(!StringUtils.hasText(signupDto.getMobileNumber())){
                log.error("Got empty mobile: {}",signupDto);
                return ResponseEntity.badRequest().body(ResponseBurp.builder().status("Empty mobile").build());
            }
            val entity = StoredBusiness.builder()
                    .businessName(signupDto.getBusinessName())
                    .businessWebsiteLink(signupDto.getBusinessLink())
                    .mobileNumber(signupDto.getMobileNumber())
                    .build();
            signupRepo.save(entity);
            return ResponseEntity.ok(ResponseBurp.builder().status("BURP").build());
        }catch (DataIntegrityViolationException d){
            return ResponseEntity.ok(ResponseBurp.builder().status("BURP").build());
        }catch (Exception e){
            log.error("failed",e);
            return ResponseEntity.internalServerError().body(ResponseBurp.builder().status(e.getMessage()).build());
        }

    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v1/additional")
    public ResponseEntity<ResponseBurp> update(@RequestBody SignupDto signupDto){
        try {
            log.info("Got dto: {}", signupDto);
            val entity = signupRepo.findByMobileNumber(signupDto.getMobileNumber());
            entity.setBusinessName(signupDto.getBusinessName());
            entity.setBusinessWebsiteLink(signupDto.getBusinessLink());
            entity.setUserName(signupDto.getUserName());
            entity.setEmailId(signupDto.getEmailId());
            signupRepo.save(entity);
            return ResponseEntity.ok(ResponseBurp.builder().status("BURP").build());
        }catch (Exception e){
            log.error("failed",e);
            return ResponseEntity.internalServerError().body(ResponseBurp.builder().status(e.getMessage()).build());
        }
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v1/response")
    public ResponseEntity<ResponseBurp> createResponse(@RequestBody ResponseDto responseDto){
        try {
            log.info("Got dto: {}", responseDto);
            val uuid = UUID.randomUUID().toString();
            val storedResponses = StoredResponses.builder()
                    .businessId(responseDto.getCompanyName())
                    .responseId(uuid)
                    .review(objectMapper.writeValueAsBytes(responseDto))
                    .build();
            responseRepo.save(storedResponses);
            gptService.getReview(uuid);
            return ResponseEntity.ok(ResponseBurp.builder().status("BURP").responseId(uuid).build());
        }catch (Exception e){
            log.error("failed",e);
            return ResponseEntity.internalServerError().body(ResponseBurp.builder().status(e.getMessage()).build());
        }
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v2/response")
    public ResponseEntity<ResponseBurp> createResponse(@RequestBody ResponseDto responseDto,@RequestParam("formId")String formId){
        try {
            log.info("Got dto: {}", responseDto);
            val uuid = UUID.randomUUID().toString();
            val storedResponses = StoredResponses.builder()
                    .businessId(responseDto.getCompanyName())
                    .responseId(uuid)
                    .review(objectMapper.writeValueAsBytes(responseDto))
                    .formId(formId)
                    .build();
            responseRepo.save(storedResponses);
            gptService.getReview(uuid);
            return ResponseEntity.ok(ResponseBurp.builder().status("BURP").responseId(uuid).build());
        }catch (Exception e){
            log.error("failed",e);
            return ResponseEntity.internalServerError().body(ResponseBurp.builder().status(e.getMessage()).build());
        }
    }

    @CrossOrigin(origins = {"*"})
    @GetMapping("/v1/review")
    public ResponseEntity<ResponseBurp> getResponse(@RequestParam("responseId")String responseId){
        try {
            val entity = responseRepo.findByResponseId(responseId);
            if(entity.getResponse()!=null) {
                val dto = objectMapper.readValue(entity.getResponse(), GptContext.class);
                log.info("Got dto: {}",dto);
                if(dto.getResp()!=null) {
                    return ResponseEntity.ok(ResponseBurp.builder().status("BURP").review(dto.getResp().getChoices().get(0).getMessage().getContent()).build());
                }
                else{
                    return ResponseEntity.ok(ResponseBurp.builder().status("BURP").build());
                }
            }
            else{
                return ResponseEntity.ok(ResponseBurp.builder().status("BURP").build());
            }
        }catch (Exception e){
            log.error("failed",e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/v1/test")
    public ResponseEntity<List<StoredBusiness>> update(@RequestParam("password")String pass, @RequestParam("mobile")String mobile){
        try {
            if("62b8864c-2aa3-4fa7-8043-7987ca4b21e9".equalsIgnoreCase(pass)){
                return ResponseEntity.ok(signupRepo.findAll());
            }
            else{
                return ResponseEntity.badRequest().build();
            }
        }catch (Exception e){
            log.error("failed",e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/isAlive")
    public String alive(){
        return "UP";
    }


}
