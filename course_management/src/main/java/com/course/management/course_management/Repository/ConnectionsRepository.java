package com.course.management.course_management.Repository;

import com.course.management.course_management.Model.Connections;
import com.course.management.course_management.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionsRepository extends JpaRepository<Connections, Long> {
    Optional<Connections> findBySenderAndReceiver(Student sender, Student receiver);
    List<Connections> findBySenderOrReceiver(Student sender, Student receiver);
    @Query("SELECT c FROM Connections c WHERE (c.sender = :student OR c.receiver = :student) AND c.isConnected = true")
    List<Connections> findBySenderOrReceiverAndIsConnected(@Param("student") Student student);
}
