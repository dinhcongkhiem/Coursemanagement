package com.course.management.course_management.Service;


import com.course.management.course_management.Model.ChatMessage;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Repository.ChatMessageRepository;
import com.course.management.course_management.Repository.StudentRepository;
import com.course.management.course_management.Request.findChatMessageRequest;
import com.course.management.course_management.Response.AllChatMessagesResponse;
import com.course.management.course_management.Response.StudentInConnectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ConnectionsService connectionsService;


    public ChatMessage save(ChatMessage chatMessage) {
        chatMessageRepository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(Long connectionId, Date timestamp) {
        List<ChatMessage> listChatmesage = chatMessageRepository.findByConnectionIdAndLessThanCreateAt(connectionId, timestamp,
                PageRequest.of(0, 15, Sort.by(Sort.Direction.DESC, "createAt")));
        Collections.reverse(listChatmesage);
        return listChatmesage;
    }

    public List<AllChatMessagesResponse> findAllChatMessages(Date timestamp) {
        List<StudentInConnectResponse> studentInConnectResponseList = connectionsService.getListStudentInConnections();
        List<AllChatMessagesResponse> AllChatMessages = new ArrayList<>();
        for (StudentInConnectResponse studentInConnectResponse : studentInConnectResponseList) {
            AllChatMessages.add(AllChatMessagesResponse.builder()
                    .connectionId(studentInConnectResponse.getConnectionId())
                    .listChatMessage(findChatMessages(studentInConnectResponse.getConnectionId(), timestamp))
                    .build());
        }
        return AllChatMessages;

    }


}
