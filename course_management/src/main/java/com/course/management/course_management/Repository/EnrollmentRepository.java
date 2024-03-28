package com.course.management.course_management.Repository;

import com.course.management.course_management.Model.Courses;
import com.course.management.course_management.Model.Enrollment;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Response.CourseReponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment,Long> {
    List<CourseReponse> findByStudent(Student student);
    Optional<Enrollment> findByCourseAndStudent(Courses courses, Student student);

    List<Enrollment> findByCourse(Courses course);
}
