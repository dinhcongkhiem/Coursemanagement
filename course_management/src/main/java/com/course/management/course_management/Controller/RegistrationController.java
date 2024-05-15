package com.course.management.course_management.Controller;


import com.course.management.course_management.Exception.StudentAlreadyExistsException;
import com.course.management.course_management.Exception.StudentNotFoundException;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Request.ChangePasswordRequest;
import com.course.management.course_management.Request.RequestRefreshToken;
import com.course.management.course_management.Request.ResetPasswordRequest;
import com.course.management.course_management.Response.LoginResponse;
import com.course.management.course_management.Service.StudentService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.NoSuchElementException;

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
    @PostMapping("/setnewpassword")
    public ResponseEntity<?> setNewPassword(@RequestBody ChangePasswordRequest changePasswordRequest, @RequestParam String activeKey){
        return ResponseEntity.ok().body(studentService.setNewPassword(changePasswordRequest, activeKey));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Student student){
        try {
            LoginResponse response = studentService.login(student);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or password is incorrect");
        }
    }


    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam String activeKey){
        return studentService.VerifyAccount(activeKey) ?
                ResponseEntity.ok("Your account has been verified") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Your email verification time has passed, please click resend the email. We will send a new verification email to you!");

    }

    @PostMapping("/refresh_token")
    public ResponseEntity<?> refreshJwtToken(@RequestBody RequestRefreshToken requestRefreshToken){
        try {
            LoginResponse response = studentService.refreshAccessToken(requestRefreshToken.getRefresh_token());
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error refreshing access token");
        }
    }





}
