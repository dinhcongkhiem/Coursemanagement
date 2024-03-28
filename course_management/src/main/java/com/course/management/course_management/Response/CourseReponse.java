package com.course.management.course_management.Response;

import com.course.management.course_management.Model.Courses;
import com.course.management.course_management.Model.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CourseReponse {
    private Long id;
    private Courses course;

    private int desiredScore;
    private String note;

}
