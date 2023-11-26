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
@Table(name = "user",indexes = {@Index(name = "user_idx",columnList = "userId",unique = true),
        @Index(name = "company_idx",columnList = "companyId",unique = true),
        @Index(name = "email_idx",columnList = "emailId",unique = true)})
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoredUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @Version
    private Long version;

    private String userId;
    private String emailId;
    private String companyName;
    private String companyId;
    @Lob
    @Column(name = "company_logo",columnDefinition="BLOB")
    private byte[] companyLogo;
}
