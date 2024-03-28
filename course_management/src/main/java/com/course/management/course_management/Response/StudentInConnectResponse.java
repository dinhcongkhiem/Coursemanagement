package com.course.management.course_management.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentInConnectResponse {
    private Long connectionId;
    private Long studentId;
    private String name;
    private String avatar;
}
