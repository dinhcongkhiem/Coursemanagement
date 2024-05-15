package com.course.management.course_management.Service;

import com.course.management.course_management.Model.OTPentity;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Repository.OTPEntityRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.hibernate.tool.schema.internal.exec.ScriptTargetOutputToFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OTPService {
    private final TemplateEngine templateEngine;

    private final JavaMailSender mailSender;
    private final OTPEntityRepository otpEntityRepository;
    @Value("${client.url}")
    private String client_Url;


    public String generateOTP() {
        String otp = "";
        for (int i = 0; i < 6; i++) {
            otp += (int) (Math.random() * 10);
        }
        return otp;
    }

    public String createNewOTP(Student student) {
        String newOTP = generateOTP();
        OTPentity otpEntity = OTPentity.builder()
                .otp(newOTP)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 5))
                .student(student)
                .build();
        otpEntityRepository.save(otpEntity);
        return newOTP;
    }
    @Scheduled(fixedRate = 10000)
    public void scheduledTask() {
        List<OTPentity> otPentityList = otpEntityRepository.findAll();
        for(OTPentity otPentity : otPentityList){
            if(otPentity.getExpiration().before(new Date())){
                otpEntityRepository.delete(otPentity);
            }
        }
    }


    public boolean isValidOTP(String otp, Student student) {
        Optional<OTPentity> otPentityOptional = otpEntityRepository.findByOtpAndStudent(otp, student);
        if (otPentityOptional.isEmpty()) {
            throw new NoSuchElementException("Invalid OTP or student combination");
        }

        OTPentity otPentity = otPentityOptional.get();
        return otPentity.getExpiration().after(new Date());
    }

    public void sendOTPEmail(Student student) throws MessagingException {

        String emailFrom = "khiemcongdinh@gmail.com";
        String subject = "Request a password change in the course manager";

        Context context = new Context();
        context.setVariable("student", student);
        context.setVariable("otp", this.createNewOTP(student));
        context.setVariable("frontendHost", client_Url);

        String htmlContent = templateEngine.process("sendOTPEmail", context);
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom(emailFrom);
        helper.setTo(student.getEmail());
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);

    }
}
