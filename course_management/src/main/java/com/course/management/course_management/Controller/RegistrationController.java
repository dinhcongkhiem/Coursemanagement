package com.course.management.course_management.Controller;


import com.course.management.course_management.Exception.StudentAlreadyExistsException;
import com.course.management.course_management.Exception.StudentNotFoundException;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Request.ResetPasswordRequest;
import com.course.management.course_management.Response.LoginResponse;
import com.course.management.course_management.Service.StudentService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/auth")
public class RegistrationController {
    private final StudentService studentService;

    @PostMapping("/register")
    public ResponseEntity<String> registerStudent(@RequestBody Student student)
        throws MessagingException, IOException {
        try{
            studentService.resigterStudent(student);
            return ResponseEntity.ok("Please check your email to active account");
        } catch (StudentAlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student with email " + student.getEmail() + " already exists");
        }
    }
    @PostMapping("/reset/password")
    public ResponseEntity<String> resetPasswordRequest(@RequestBody ResetPasswordRequest resetPasswordRequest){
        try{
            studentService.resetPassword(resetPasswordRequest.getEmail());
            return ResponseEntity.ok("Please check your email to reset your password");
        } catch (StudentNotFoundException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student with email " + resetPasswordRequest.getEmail() + " not found");
        }

    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody Student student){
        return ResponseEntity.ok(new LoginResponse(studentService.login(student)));
    }


    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam String activeKey){
        return studentService.VerifyAccount(activeKey) ?
                ResponseEntity.ok("Your account has been verified") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Your email verification time has passed, please click resend the email. We will send a new verification email to you!");

    }





}
