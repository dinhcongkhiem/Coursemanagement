package com.course.management.course_management.Controller;

import com.course.management.course_management.Exception.EnrolmentAlreadyExistsException;
import com.course.management.course_management.Model.Enrollment;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Repository.StudentRepository;
import com.course.management.course_management.Request.ChangePasswordRequest;
import com.course.management.course_management.Request.EnrollmentRequest;
import com.course.management.course_management.Response.CourseReponse;
import com.course.management.course_management.Response.StudentResponse;
import com.course.management.course_management.Service.EnrollmentService;
import com.course.management.course_management.Service.OTPService;
import com.course.management.course_management.Service.StudentService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/student")
public class StudentController {
    private final StudentRepository studentRepository;
    private final StudentService studentService;
    private final EnrollmentService enrollmentService;
    private  final OTPService otpService;

    @GetMapping()
    public ResponseEntity<StudentResponse> getStudentInfo() {
        return ResponseEntity.ok(studentService.getStudentInfo());
    }

    @PostMapping("password")
    public ResponseEntity<StudentResponse> changPassword(@RequestBody ChangePasswordRequest changePasswordRequest, @RequestParam String otp){
        return ResponseEntity.ok(studentService.changePassword(changePasswordRequest, otp));
    }

    @GetMapping("password")
    public ResponseEntity<?> RequestChangePassword(){
        try {
            otpService.sendOTPEmail(studentService.getCurrentStudent());
            return ResponseEntity.ok("Your password change request has been sent to your email. Please check your email to get your OTP");
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error sending password change request. Please try again later.");

        }

    }

    @PostMapping("/course")
    public ResponseEntity<String> addCourse(@RequestBody EnrollmentRequest enrollmentRequest) {
        try {
            enrollmentService.AddNewCourse(enrollmentRequest);
            return ResponseEntity.ok("Successfully");
        } catch (EnrolmentAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You have registered for this course");
        }

    }

    @GetMapping("/course")
    public ResponseEntity<?> getAllEnrollments() {
        try {
            List<CourseReponse> enrollments = enrollmentService.getAllEnrollments();
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving enrollments: " + e.getMessage());
        }
    }

    @PutMapping("/course")
    public ResponseEntity<?> getAllEnrollments(@RequestBody EnrollmentRequest enrollmentRequest) {
        try {
            Enrollment enrollment = enrollmentService.updateEnrollments(enrollmentRequest);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving enrollments: " + e.getMessage());
        }
    }

    @DeleteMapping("/course")
    public ResponseEntity<?> removeEnrollment(@RequestParam Long id) {
        try {
            enrollmentService.removeEnrollments(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving enrollments: " + e.getMessage());
        }
    }

    @GetMapping("/incourse")
    public ResponseEntity<?> getStudentInCourse() {
        return ResponseEntity.ok(enrollmentService.getStudentInAllCourse());
    }


    @PatchMapping("/update")
    public ResponseEntity<?> uploadFile(@RequestPart(name = "avatar", required = false) MultipartFile fileAvt,
                                             @RequestPart(name = "name", required = false) String name,
                                             @RequestPart(name = "email", required = false) String email,
                                             @RequestPart(name = "address", required = false) String address,
                                             @RequestPart(name = "phone_number", required = false) String phoneNum ){

        try {
            return ResponseEntity.ok().body(studentService.updateStudent(name,fileAvt,email,address,phoneNum));
        } catch (IOException e) {
            e.printStackTrace();
            return  ResponseEntity.badRequest().body("Image is empty");
        }
    }


}
