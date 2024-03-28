package com.course.management.course_management.Service;


import com.course.management.course_management.Exception.StudentAlreadyExistsException;
import com.course.management.course_management.Exception.StudentNotFoundException;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Repository.StudentRepository;
import com.course.management.course_management.Request.ChangePasswordRequest;
import com.course.management.course_management.Response.StudentResponse;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.io.IOException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final TemplateEngine templateEngine;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final OTPService otpService;
    @Value("${files.dir}")
    private String uploadDir;

    @Value("${files.url}")
    private String filesUrl;
    @Autowired
    private JavaMailSender mailSender;
    public void resigterStudent(Student student)  {
            Optional<Student> student1 = studentRepository.findByEmail(student.getEmail());
            if (student1.isPresent()) {
                throw new StudentAlreadyExistsException(
                        "User with email " + student.getEmail() + " already exists"
                );
            }
            Student newStudent = Student
                    .builder()
                    .student_name(student.getStudent_name())
                    .email(student.getEmail())
                    .password(passwordEncoder.encode(student.getPassword()))
                    .address(student.getAddress())
                    .phoneNum(student.getPhoneNum())
                    .activeKey(this.generateActiveKey())
                    .refreshToken(this.generateRefreshToken(student.getEmail()))
                    .build();
            this.sendEmail(newStudent,"Welcome to RMIT University","SendVerifyEmail");
            studentRepository.save(newStudent);
    }

    public void resetPassword(String email){
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isEmpty()) {
            throw new StudentNotFoundException(
                    "Student with email " + email + " already exists"
            );
        }
        Student updateStd = student.get();
        updateStd.setActiveKey(this.generateActiveKey());
        studentRepository.save(updateStd);
        this.sendEmail(updateStd,"Reset password","ResetPasswordEmail");


    }
    public  String generateRefreshToken(String email){
        return String.valueOf(UUID.nameUUIDFromBytes(email.getBytes()));
    }
    public String login(Student loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        ));
        var student = studentRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        return jwtService.generateToken(student);
    }
    public Student getCurrentStudent() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                return (Student) authentication.getPrincipal();

            }
            return null;

    }

    public StudentResponse getStudentInfo () {
        Student student = this.getCurrentStudent();
        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getStudent_name())
                .email(student.getEmail())
                .phoneNum(student.getPhoneNum())
                .address(student.getAddress())
                .avatar(student.getAvatar())
                .build();
    }
    public String generateActiveKey() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String ActiveTime = sdf.format(new Date(System.currentTimeMillis() + 1000 * 60 * 60));
        return ActiveTime + UUID.randomUUID();
    }

    public void ResendEmailVerify(String email) {
        Student newStudent = this.studentRepository.findByEmail(email).orElseThrow();
        newStudent.setActiveKey(generateActiveKey());
        studentRepository.save(newStudent);
        this.sendEmail(newStudent,"Welcome to RMIT University","SendVerifyEmail");

    }

    public boolean VerifyAccount(String activeKey) {
        Student student = studentRepository.findByActiveKey(activeKey).orElseThrow();
        if (validActiveKey(activeKey)) {
            student.setEnabled(true);
            studentRepository.save(student);
            return true;
        } else {
            return false;
        }

    }

    public boolean validActiveKey(String activeKey) {
        try {

            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
            Date CurrentTime = new Date();
            String activeTime = activeKey.substring(0, 14);
            return CurrentTime.before(sdf.parse(activeTime));
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public StudentResponse changePassword( ChangePasswordRequest changePasswordRequest, String otp){
        Student student = getCurrentStudent();
        if(otpService.isValidOTP(otp,student)){
            student.setPassword(passwordEncoder.encode(changePasswordRequest.getPassword()));
        }
        studentRepository.save(student);
        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getStudent_name())
                .email(student.getEmail())
                .phoneNum(student.getPhoneNum())
                .address(student.getAddress())
                .avatar(student.getAvatar())
                .build();
    }

    public StudentResponse updateStudent(String name,MultipartFile fileAvt,String email,String address, String phoneNum ) throws IOException {
        Student student = this.getCurrentStudent();
        if(name != null){
            student.setStudent_name(name);
        }
        if(email != null){
            student.setEmail(email);
        }
        if(address != null){
            student.setAddress(address);
        }
        if(phoneNum != null){
            student.setPhoneNum(phoneNum);
        }
        if (fileAvt != null) {
            fileAvt.transferTo(new File(uploadDir + fileAvt.getOriginalFilename()));
            student.setAvatar(filesUrl + "/student/avatar/" + fileAvt.getOriginalFilename());

        }
        studentRepository.save(student);
        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getStudent_name())
                .email(student.getEmail())
                .phoneNum(student.getPhoneNum())
                .address(student.getAddress())
                .avatar(student.getAvatar())
                .build();
    }


    public void sendEmail(Student student, String subject, String template) {
        try {
            String emailFrom = "khiemcongdinh@gmail.com";

            Context context = new Context();
            context.setVariable("student", student);

            String htmlContent = templateEngine.process(template, context);
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
