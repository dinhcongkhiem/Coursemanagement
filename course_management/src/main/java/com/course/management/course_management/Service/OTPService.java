package com.course.management.course_management.Service;

import com.course.management.course_management.Model.OTPentity;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Repository.OTPEntityRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Date;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OTPService {
    private final TemplateEngine templateEngine;

    private JavaMailSender mailSender;
    private final OTPEntityRepository otpEntityRepository;

    public String generateOTP() {
        String otp = "";
        for (int i = 0; i < 6; i++) {
            otp += (int) (Math.random() * 10);
        }
        return otp;
    }

    public String createNewOTP(Student student){
        String newOTP = generateOTP();
        OTPentity otpEntity = OTPentity.builder()
                .otp(newOTP)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 5 ))
                .student(student)
                .build();
        otpEntityRepository.save(otpEntity);
        return newOTP;
    }


    public boolean isValidOTP(String otp, Student student) {
        Optional<OTPentity> otPentityOptional = otpEntityRepository.findByOtpAndStudent(otp, student);

        if (otPentityOptional.isEmpty()) {
            throw new NoSuchElementException("Invalid OTP or student combination");
        }

        OTPentity otPentity = otPentityOptional.get();
        return otPentity.getExpiration().before(new Date());
    }
    public void sendOTPEmail(Student student) throws MessagingException {

            String emailFrom = "khiemcongdinh@gmail.com";
            String subject = "Request a password change in the course manager";

            Context context = new Context();
            context.setVariable("student", student);
            context.setVariable("otp",this.createNewOTP(student));
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
