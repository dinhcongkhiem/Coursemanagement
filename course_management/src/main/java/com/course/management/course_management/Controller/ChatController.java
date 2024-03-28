package com.course.management.course_management.Controller;

import com.course.management.course_management.Model.ChatMessage;
import com.course.management.course_management.Repository.StudentRepository;
import com.course.management.course_management.Service.ChatMessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Controller
@AllArgsConstructor
public class ChatController {
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        return chatMessage;
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) throws Exception {
        System.out.println(chatMessage);
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        System.out.println(chatMessage.getRecipientId());

        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getRecipientId()), "/queue/messages",
                savedMsg
        );
    }
    @GetMapping("/messages")
    public ResponseEntity<?> findAllChatMessages(@RequestParam String timestamp) {
        System.out.println(timestamp);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
        try {
            Date date = dateFormat.parse(timestamp);
            return ResponseEntity.ok(chatMessageService.findAllChatMessages(date));

        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
//    @GetMapping("/messages/{connectionId}")
//    public ResponseEntity<?> findChatMessages(@PathVariable Long connectionId,@RequestBody findChatMessageRequest timestamp) {
//        return ResponseEntity.ok(chatMessageService.findChatMessages(connectionId, timestamp));
//    }



}
