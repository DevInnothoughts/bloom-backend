package com.bloom.signup.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "business_response",indexes = @Index(name = "review_response_idx",columnList = "responseId",unique = true))
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoredResponses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @Version
    private Long version;
    @Lob
    @Column(name = "response",columnDefinition="BLOB")
    private byte[] response;
    private String businessId;
    @Lob
    @Column(name = "review",columnDefinition="BLOB")
    private byte[] review;
    private String responseId;
    private String formId;
}
