package com.bloom.signup.controller;

import com.bloom.signup.ResponseBurp;
import com.bloom.signup.dto.*;
import com.bloom.signup.dto.forms.FormResponseDto;
import com.bloom.signup.dto.forms.FormSummaryDto;
import com.bloom.signup.dto.forms.ThemeDto;
import com.bloom.signup.dto.forms.responses.PageResponseDto;
import com.bloom.signup.dto.user.CompanyLogo;
import com.bloom.signup.entity.StoredFormSummary;
import com.bloom.signup.entity.StoredResponses;
import com.bloom.signup.repo.FormSummaryRepo;
import com.bloom.signup.repo.ResponseRepo;
import com.bloom.signup.repo.StoredUserRepo;
import com.bloom.signup.service.FormService;
import com.bloom.signup.utils.RandomString;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/v1/api/form")
@Slf4j
public class FormController {

    @Autowired
    private FormSummaryRepo formSummaryRepo;

    @Autowired
    private ResponseRepo responseRepo;

    @Autowired
    private StoredUserRepo storedUserRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v1/init")
    public ResponseEntity<String> createForm() {
        val formId = new RandomString().randomString(8).toUpperCase();
        val form = StoredFormSummary.builder()
                .formId(formId)
                .build();
        formSummaryRepo.save(form);
        return ResponseEntity.ok(formId);
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v2/init")
    public ResponseEntity<String> createForm(@RequestParam("companyId")String companyId) {
        val formId = new RandomString().randomString(8).toUpperCase();
        val form = StoredFormSummary.builder()
                .formId(formId)
                .companyId(companyId)
                .build();
        formSummaryRepo.save(form);
        return ResponseEntity.ok(formId);
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v1/updateFormSettings")
    @SneakyThrows
    public ResponseEntity<ResponseBurp> updateForm(@RequestBody FormSummaryDto formSummaryDto, @RequestParam("formId") String formId) {
        val storedForm = formSummaryRepo.findByFormId(formId);
        storedForm.setAboutForm(objectMapper.writeValueAsBytes(formSummaryDto));
        formSummaryRepo.save(storedForm);
        return ResponseEntity.ok(ResponseBurp.builder().status("BURP").build());
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v1/updateFormContent")
    @SneakyThrows
    public ResponseEntity<ResponseBurp> updateFormData(@RequestBody Map<String, Object> formData, @RequestParam("formId") String formId) {
        val storedForm = formSummaryRepo.findByFormId(formId);
        storedForm.setFormContent(objectMapper.writeValueAsBytes(formData));
        formSummaryRepo.save(storedForm);
        return ResponseEntity.ok(ResponseBurp.builder().status("BURP").build());
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/v1/updateFormTheme")
    @SneakyThrows
    public ResponseEntity<ResponseBurp> updateFormTheme(@RequestBody ThemeDto themeDto, @RequestParam("formId") String formId) {
        val storedForm = formSummaryRepo.findByFormId(formId);
        storedForm.setFormTheme(objectMapper.writeValueAsBytes(themeDto));
        formSummaryRepo.save(storedForm);
        return ResponseEntity.ok(ResponseBurp.builder().status("BURP").build());
    }

    @Autowired
    private FormService formService;

    @CrossOrigin(origins = {"*"})
    @GetMapping("/v1/getForm")
    @SneakyThrows
    public ResponseEntity getForm(@RequestParam("formId") String formId) {
        val form = formSummaryRepo.findByFormId(formId);
        val user = storedUserRepo.findByCompanyId(form.getCompanyId());
        val formDto = formService.getForm(form,user);
        return ResponseEntity.ok(formDto);
    }


    @CrossOrigin(origins = {"*"})
    @GetMapping("/v1/migrate")
    @SneakyThrows
    public ResponseEntity migrate(@RequestParam("formId")String formId,@RequestParam("businessId")String businessId){
        //val storedForm = formSummaryRepo.findByFormId(formId);
        val pages = responseRepo.findByBusinessId(businessId);
        pages.forEach(v->{
            if(!StringUtils.hasText(v.getFormId())){
                v.setFormId(formId);
            }
        });
        responseRepo.saveAll(pages);
        val responseMap = new HashMap<String,Map<String, QuestionResponseDto>>();

        return ResponseEntity.ok("Done");
    }

    public static void main(String[] args) {
        List<String> data = Arrays.asList("Data");
        System.out.println(String.join(", ", data));
    }

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");


    @GetMapping("/v2/getInternal")
    public ResponseEntity getInternalResponse(){

    }

    @CrossOrigin(origins = {"*"})
    @GetMapping("/v1/getFormResponse")
    @SneakyThrows
    public ResponseEntity getFormResponses(@RequestParam("formId")String formId,@RequestParam("pageNo")Integer pageNo,
                                           @RequestParam("pageSize")Integer pageSize){
        val pageReq = PageRequest.of(pageNo,pageSize, Sort.by("createdAt").descending());
        val pages = responseRepo.findByFormId(formId,pageReq);
        val responseMap = new ArrayList<Map<String,String>>();
        val secondMap = new HashMap<String,String>();
        secondMap.put("createdAt","Created At");
        pages.forEach(v->{
            try {
                if(v.getReview()!=null) {
                    val resp = objectMapper.readValue(v.getReview(), ResponseDto.class);
                    val map = new HashMap<String,String>();
                    if(resp.getQueryParams()!=null){
                        resp.getQueryParams().forEach((a,b)->{
                            map.put(a,objectMapper.convertValue(b,String.class));
                            secondMap.put(a,a);
                        });
                    }
                    map.put("responseId",v.getResponseId());
                    map.put("createdAt",dateTimeFormatter.format(v.getCreatedAt()));
                    resp.getResponses().forEach((a,b)->{
                        if(b!=null) {
                            log.info(" data: {}",b.getResponses());
                            if (b.getResponses() != null) {
                                if(dataRemap().containsKey(b.getQuestionId())){
                                    map.put(dataRemap().get(b.getQuestionId()),String.join(", ", b.getResponses()));
                                    secondMap.put(dataRemap().get(b.getQuestionId()),b.getQuestionTitle());
                                }
                                else {
                                    map.put(b.getQuestionId(), String.join(", ", b.getResponses()));
                                    secondMap.put(b.getQuestionId(),b.getQuestionTitle());
                                }

                            }
                            else if(b.getRating()!=null){
                                if(dataRemap().containsKey(b.getQuestionId())){
                                    map.put(dataRemap().get(b.getQuestionId()),b.getRating());
                                    secondMap.put(dataRemap().get(b.getQuestionId()),b.getQuestionTitle());
                                }
                                else {
                                    map.put(b.getQuestionId(), b.getRating());
                                    secondMap.put(b.getQuestionId(), b.getQuestionTitle());
                                }
                            }
                        }
                    });
                    responseMap.add(map);
                }
            }catch (Exception e){
                log.error("Failed parsing {}",v,e);
            }
        });
        return ResponseEntity.ok(PageResponseDto.builder()
                .totalPages(pages.getTotalPages())
                .data(responseMap)
                        .questionIdMap(secondMap)
                        .totalResponses(pages.getTotalElements())
                .build());
    }

    private Map<String,String> dataRemap(){
        val map = new HashMap<String,String>();
        map.put("EVExperienceOptions","6");
        map.put("driverFeedback","5");
        map.put("driverReviewOptions","3");
        map.put("driverRating","4");
        map.put("rideReviewOptions","2");
        map.put("overallRating","1");
        return map;
    }

    @GetMapping("/v1/test2")
    public ResponseEntity<List<StoredResponses>> update(@RequestParam("password") String pass, @RequestParam("businessId") String businessId) {
        try {
            if ("62b8864c-2aa3-4fa7-8043-7987ca4b21e9".equalsIgnoreCase(pass)) {
                return ResponseEntity.ok(responseRepo.findAll());
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            log.error("failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }



    @CrossOrigin(origins = {"*"})
    @GetMapping("/v1/internal/getFormResponse")
    @SneakyThrows
    public ResponseEntity getFormResponsesBusinessId(@RequestParam("businessId")String businessId,@RequestParam("pageNo")Integer pageNo,
                                           @RequestParam("pageSize")Integer pageSize){
        val pageReq = PageRequest.of(pageNo,pageSize, Sort.by("createdAt").descending());
        val pages = responseRepo.findByBusinessId(businessId);
        val responseMap = new HashMap<String,Map<String,Object>>();
        pages.forEach(v->{
            try {
                val map = new HashMap<String,Object>();
                map.put("createdAt",v.getCreatedAt());
                if(v.getReview()!=null) {
                    map.put("review",objectMapper.readValue(v.getReview(),ResponseDto.class));

                }
                if(v.getResponse()!=null){
                    map.put("response",objectMapper.readValue(v.getResponse(),GptContext.class));
                }
                responseMap.put(v.getResponseId(),map);
            }catch (Exception e){
                log.error("Failed parsing {}",v,e);
            }
        });
        return ResponseEntity.ok(responseMap);
    }


}
