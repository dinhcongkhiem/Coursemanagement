package com.course.management.course_management.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class StudentInCourseResponse {
    private Long studentId;
    private String studentName;
    private String avatar;
    private int desiredScore;
    private String note;
}
