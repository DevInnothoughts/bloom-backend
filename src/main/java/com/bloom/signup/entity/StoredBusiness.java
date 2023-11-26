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
@Table(name = "business_details",indexes = @Index(name = "business_mobile_idx",columnList = "mobileNumber",unique = true))
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoredBusiness {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String mobileNumber;
    private String businessName;
    private String businessWebsiteLink;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @Version
    private Long version;
    private String userName;
    private String emailId;
}
