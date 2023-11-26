package com.bloom.signup.repo;

import com.bloom.signup.entity.StoredResponses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ResponseRepo extends JpaRepository<StoredResponses,Long> {
    StoredResponses findByResponseId(String responseId);

    Page<StoredResponses> findByFormId(String formId,
                                       Pageable pageable);

    long countByFormId(String formId);

    List<StoredResponses> findByBusinessId(String businessId);
}
