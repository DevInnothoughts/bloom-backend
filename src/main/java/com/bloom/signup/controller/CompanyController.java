package com.bloom.signup.controller;

import com.bloom.signup.dto.forms.FormResponseDto;
import com.bloom.signup.dto.forms.responses.CompanyFormResponseDto;
import com.bloom.signup.dto.user.CompanyLogo;
import com.bloom.signup.dto.user.UserDto;
import com.bloom.signup.entity.StoredResponses;
import com.bloom.signup.entity.StoredUser;
import com.bloom.signup.repo.FormSummaryRepo;
import com.bloom.signup.repo.StoredUserRepo;
import com.bloom.signup.service.FormService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/api/company")
@Slf4j
public class CompanyController {

    @Autowired
    private StoredUserRepo storedUserRepo;

    @Autowired
    private ObjectMapper objectMapper;


    @GetMapping("/v2/companies")
    public ResponseEntity<List<UserDto>> getAllUsers(@RequestParam("pass")String pass) {
        try {
            if ("62b8864c-2aa3-4fa7-8043-7987ca4b21e9".equalsIgnoreCase(pass)) {
                return ResponseEntity.ok(storedUserRepo.findAll().stream().map(v-> {
                    try {
                        return UserDto.builder()
                                .companyName(v.getCompanyName())
                                .userId(v.getUserId())
                                .emailId(v.getEmailId())
                                .companyLogo(objectMapper.readValue(v.getCompanyLogo(),CompanyLogo.class))
                                .companyId(v.getCompanyId())
                                .build();
                    } catch (IOException e) {
                        log.error("Error ",e);
                        throw new RuntimeException(e);
                    }
                }).collect(Collectors.toList()));
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            log.error("failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Autowired
    private FormSummaryRepo formSummaryRepo;

    @Autowired
    private FormService formService;

    @GetMapping("/v1/forms")
    @CrossOrigin(origins = {"*"})
    public ResponseEntity<List<CompanyFormResponseDto>> getFormsByCompantId(@RequestParam("companyId")String companyId){
        return ResponseEntity.ok(formService.getForms(companyId));
    }

    @PostMapping("/v2/map")
    public ResponseEntity<String> reMap(@RequestParam("emailId") String emailId, @RequestParam("formId") String formId,
                                                  @RequestParam("pass")String pass) {
        try {
            if ("62b8864c-2aa3-4fa7-8043-7987ca4b21e9".equalsIgnoreCase(pass)) {
                val user = storedUserRepo.findByEmailId(emailId);
                val form = formSummaryRepo.findByFormId(formId);
                form.setCompanyId(user.getCompanyId());
                formSummaryRepo.save(form);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            log.error("failed", e);
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok("Done");
    }

    @GetMapping("/v1/onboarding")
    @CrossOrigin(origins = {"*"})
    @SneakyThrows
    public ResponseEntity<UserDto> getUser(@RequestParam("emailId") String emailId) {
        val response = storedUserRepo.findByEmailId(emailId);
        if (response != null) {
            return ResponseEntity.ok(UserDto.builder()
                    .companyId(response.getCompanyId())
                    .companyLogo(objectMapper.readValue(response.getCompanyLogo(), CompanyLogo.class))
                    .userId(response.getUserId())
                            .companyName(response.getCompanyName())
                    .emailId(response.getEmailId()).build());
        }
        return ResponseEntity.ok(new UserDto());
    }

    @PostMapping("/v1/onboarding")
    @CrossOrigin(origins = {"*"})
    @SneakyThrows
    public ResponseEntity<UserDto> createUpdateUser(@RequestBody UserDto userDto) {
        val user = storedUserRepo.findByEmailId(userDto.getEmailId());
        if (user == null) {
            val newUser = StoredUser.builder()
                    .userId(UUID.randomUUID().toString())
                    .companyId(UUID.randomUUID().toString())
                    .companyLogo(objectMapper.writeValueAsBytes(userDto.getCompanyLogo()))
                    .emailId(userDto.getEmailId())
                    .companyName(userDto.getCompanyName())
                    .build();
            storedUserRepo.save(newUser);
            return ResponseEntity.ok(UserDto.builder()
                    .companyId(newUser.getCompanyId())
                    .companyLogo(objectMapper.readValue(newUser.getCompanyLogo(), CompanyLogo.class))
                    .emailId(newUser.getEmailId())
                    .userId(newUser.getUserId())
                    .companyName(newUser.getCompanyName()).build());
        } else {
            if (userDto.getCompanyLogo() != null) {
                user.setCompanyLogo(objectMapper.writeValueAsBytes(userDto.getCompanyLogo()));
                val newUser = storedUserRepo.save(user);
                return ResponseEntity.ok(UserDto.builder()
                        .companyId(newUser.getCompanyId())
                        .companyLogo(objectMapper.readValue(newUser.getCompanyLogo(), CompanyLogo.class))
                        .emailId(newUser.getEmailId())
                        .userId(newUser.getUserId()).build());
            }if (userDto.getCompanyName()!=null){
                user.setCompanyName(userDto.getCompanyName());
                val newUser = storedUserRepo.save(user);
                return ResponseEntity.ok(UserDto.builder()
                        .companyId(newUser.getCompanyId())
                        .companyLogo(objectMapper.readValue(newUser.getCompanyLogo(), CompanyLogo.class))
                        .emailId(newUser.getEmailId())
                                .companyName(newUser.getCompanyName())
                        .userId(newUser.getUserId()).build());
            }
            return ResponseEntity.ok(UserDto.builder()
                    .companyId(user.getCompanyId())
                    .companyLogo(objectMapper.readValue(user.getCompanyLogo(), CompanyLogo.class))
                    .emailId(user.getEmailId())
                    .userId(user.getUserId())
                    .companyName(user.getCompanyName()).build());
        }


    }
}
