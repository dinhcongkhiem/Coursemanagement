package com.course.management.course_management.Service;

import com.course.management.course_management.Model.Connections;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Repository.ConnectionsRepository;
import com.course.management.course_management.Repository.StudentRepository;
import com.course.management.course_management.Request.ConnectionsRequest;
import com.course.management.course_management.Response.ConnectionResponse;
import com.course.management.course_management.Response.StudentInConnectResponse;
import com.course.management.course_management.Response.StudentResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ConnectionsService {
    private final ConnectionsRepository connectionsRepository;
    private final StudentService studentService;
    private final StudentRepository studentRepository;
    private final TemplateEngine templateEngine;
    @Autowired
    private JavaMailSender mailSender;

    public Connections createConnection(ConnectionsRequest request) {
        Student currentStudent = studentService.getCurrentStudent();
        Student receiver = studentRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Optional<Connections> existingConnection = connectionsRepository.findBySenderAndReceiver(receiver, currentStudent);

        if (existingConnection.isPresent()) {
            Connections connection = existingConnection.get();
            connection.setConnected(true);
            connectionsRepository.save(connection);
            return connection;
        } else {
            Connections newConnection = Connections.builder()
                    .sender(currentStudent)
                    .receiver(receiver)
                    .build();
            connectionsRepository.save(newConnection);
            return newConnection;
        }
    }
    public List<ConnectionResponse> getConnections(){
        Student currentStudent = studentService.getCurrentStudent();
        return connectionsRepository.findBySenderOrReceiver(currentStudent, currentStudent)
                .stream()
                .map(connections -> ConnectionResponse.builder()
                        .id(connections.getId())
                        .senderId(connections.getSender().getId())
                        .receiverId(connections.getReceiver().getId())
                        .isConnected(connections.isConnected())
                        .build())
                .toList();
    }
    public List<StudentInConnectResponse> getListStudentInConnections() {
        Student student = studentService.getCurrentStudent();
        List<Connections> connections = connectionsRepository.findBySenderOrReceiverAndIsConnected(student);
        return connections.stream()
                .map(connection -> {
                    Student sender = connection.getSender();
                    Student receiver = connection.getReceiver();

                    Student targetStudent = (Objects.equals(sender.getId(), student.getId())) ? receiver : sender;
                    return StudentInConnectResponse.builder()
                            .connectionId(connection.getId())
                            .studentId(targetStudent.getId())
                            .name(targetStudent.getStudent_name())
                            .avatar(targetStudent.getAvatar())
                            .build();
                })
                .collect(Collectors.toList());
    }


    public void sendEmail(Student student) {
        try {
            String emailFrom = "khiemcongdinh@gmail.com";
            String subject = "Welcome to RMIT University";

            Context context = new Context();
            context.setVariable("student", student);

            String htmlContent = templateEngine.process("SendVerifyEmail", context);
            MimeMessage mimeMessage = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(emailFrom);
            helper.setTo(student.getEmail());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

    }


}
