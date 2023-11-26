package com.bloom.signup.repo;

import com.bloom.signup.entity.StoredFormSummary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormSummaryRepo extends JpaRepository<StoredFormSummary,Long> {
    StoredFormSummary findByFormId(String formId);
    List<StoredFormSummary> findByCompanyId(String companyId);
}
