package com.bloom.signup.repo;

import com.bloom.signup.entity.StoredUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoredUserRepo extends JpaRepository<StoredUser,Long> {
    StoredUser findByEmailId(String emailId);
    StoredUser findByCompanyId(String companyId);
}
