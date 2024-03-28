package com.course.management.course_management.Request;

import lombok.Data;

@Data
public class EnrollmentRequest {
    private Long id;
    private Long courseId;
    private int desiredScore;
    private String note;
}

