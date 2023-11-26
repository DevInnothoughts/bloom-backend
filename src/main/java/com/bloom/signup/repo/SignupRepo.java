package com.bloom.signup.repo;

import com.bloom.signup.entity.StoredBusiness;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SignupRepo extends JpaRepository<StoredBusiness,Long> {
    StoredBusiness findByMobileNumber(String mobileNumber);
}
