package com.course.management.course_management.Repository;

import com.course.management.course_management.Model.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,String> {

    @Query("select u from ChatMessage u where u.connectionId = ?1 and u.createAt <= ?2 ")
    List<ChatMessage> findByConnectionIdAndLessThanCreateAt(Long connectionId, Date createAt, Pageable pageable);

}
