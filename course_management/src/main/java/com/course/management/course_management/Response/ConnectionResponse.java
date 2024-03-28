package com.course.management.course_management.Response;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConnectionResponse {

    private Long id;
    private Long senderId;
    private Long receiverId;

    private boolean isConnected;
}
