package com.course.management.course_management.Repository;

import com.course.management.course_management.Model.Courses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoursesRepository extends JpaRepository<Courses,Long> {
    Optional<Courses> findByProgramCode(String program_code);


}
