package com.course.management.course_management.Request;

import lombok.Data;

@Data
public class ConnectionsRequest {
    private Long receiverId;
    private boolean isConnected  = false;
}
