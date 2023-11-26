package com.bloom.signup.service;

import com.bloom.signup.dto.CompanyDto;
import com.bloom.signup.dto.forms.FormResponseDto;
import com.bloom.signup.dto.forms.FormSummaryDto;
import com.bloom.signup.dto.forms.ThemeDto;
import com.bloom.signup.dto.forms.responses.CompanyFormResponseDto;
import com.bloom.signup.dto.user.CompanyLogo;
import com.bloom.signup.entity.StoredFormSummary;
import com.bloom.signup.entity.StoredUser;
import com.bloom.signup.repo.FormSummaryRepo;
import com.bloom.signup.repo.ResponseRepo;
import com.bloom.signup.repo.StoredUserRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FormService {
    @Autowired
    private FormSummaryRepo formSummaryRepo;

    @Autowired
    private StoredUserRepo storedUserRepo;

    @Autowired
    private ResponseRepo responseRepo;

    @Autowired
    private ObjectMapper objectMapper;

    public List<CompanyFormResponseDto> getForms(String companyId){
        return formSummaryRepo.findByCompanyId(companyId).stream().map(v-> {
            try {
                val count = responseRepo.countByFormId(v.getFormId());
                val details = objectMapper.readValue(v.getAboutForm(),FormSummaryDto.class);
                val form1 =  CompanyFormResponseDto.builder()
                        .formId(v.getFormId())
                        .totalResponses(count)
                        .createdAt(v.getCreatedAt())
                        .updatedAt(v.getUpdatedAt())
                        .name(details.getFormName());
                if(v.getAboutForm()!=null){
                    form1.noOfQuestions(objectMapper.readValue(v.getFormContent(), Map.class).size());
                }
                return form1.build();
            }catch (Exception e){
                log.error("Error",e);
                return null;
            }
        }
        ).collect(Collectors.toList());
    }
    @SneakyThrows
    public FormResponseDto getForm(StoredFormSummary storedForm, StoredUser user){
        //val storedForm = formSummaryRepo.findByFormId(formId);
        FormSummaryDto formSummaryDto;
        Map<String, Object> formContent;
        ThemeDto themeDto;
        val response = FormResponseDto.builder();
        response.formId(storedForm.getFormId());
        if (storedForm.getAboutForm() != null) {
            formSummaryDto = objectMapper.readValue(storedForm.getAboutForm(), FormSummaryDto.class);
            response.formSettings(formSummaryDto);
        }
        if (storedForm.getFormContent() != null) {
            formContent = objectMapper.readValue(storedForm.getFormContent(), Map.class);
            response.formContent(formContent);
        }
        if (storedForm.getFormTheme() != null) {
            themeDto = objectMapper.readValue(storedForm.getFormTheme(), ThemeDto.class);
            response.formTheme(themeDto);
        }
        if(user!=null && user.getCompanyLogo()!=null){
            val cl = objectMapper.readValue(user.getCompanyLogo(), CompanyLogo.class);
            val c = new CompanyDto();
            c.setCompanyName(user.getCompanyName());
            c.setImageUrl(cl.getImageUrl());
            c.setImageHeight(cl.getImageHeight());
            c.setImageWidth(cl.getImageWidth());
            c.setLogoScalingFactor(cl.getLogoScalingFactor());
            response.companyDetails(c);
        }
        else {
            response.companyDetails(new CompanyDto());
        }
        return response.build();
        //return null;
    }
}
