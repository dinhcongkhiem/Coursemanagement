package com.course.management.course_management.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentResponse {
    private Long id;
    private String name;
    private String email;
    private String address;
    private String phoneNum;
    private String avatar;
}
