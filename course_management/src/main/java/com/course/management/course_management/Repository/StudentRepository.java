package com.course.management.course_management.Repository;

import com.course.management.course_management.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByActiveKey(String activeKey);
}
