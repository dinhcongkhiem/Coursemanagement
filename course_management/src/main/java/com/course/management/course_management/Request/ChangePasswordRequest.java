package com.course.management.course_management.Request;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String password;
    private String confirmPassword;
}
