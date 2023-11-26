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
@Table(name = "form_draft",indexes = @Index(name = "form_id_idx",columnList = "formId",unique = true))
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoredFormSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String formId;
    private String companyId;
    private String formName;
    private String businessWebsiteLink;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @Lob
    @Column(name = "about_form",columnDefinition="BLOB")
    private byte[] aboutForm;
    @Lob
    @Column(name = "form_content",columnDefinition="BLOB")
    private byte[] formContent;
    @Lob
    @Column(name = "form_theme",columnDefinition="BLOB")
    private byte[] formTheme;

}
