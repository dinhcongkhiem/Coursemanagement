package com.course.management.course_management.Repository;

import com.course.management.course_management.Model.OTPentity;
import com.course.management.course_management.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPEntityRepository extends JpaRepository<OTPentity, Long> {
    Optional<OTPentity> findByOtpAndStudent(String otp, Student student);
}
