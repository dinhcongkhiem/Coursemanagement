package com.course.management.course_management.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class OTPentity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String otp;
    private Date issuedAt;
    private Date expiration;
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
    
}
