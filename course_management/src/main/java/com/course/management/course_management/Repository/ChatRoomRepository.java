package com.course.management.course_management.Repository;

import com.course.management.course_management.Model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(Long senderId, Long recipientId);

}
