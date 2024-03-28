package com.course.management.course_management.Response;

import com.course.management.course_management.Model.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
@Builder
public class AllChatMessagesResponse {
    private Long connectionId;
    private List<ChatMessage> listChatMessage;
}
