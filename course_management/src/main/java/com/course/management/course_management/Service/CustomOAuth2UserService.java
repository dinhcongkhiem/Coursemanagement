package com.course.management.course_management.Service;

import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final StudentRepository studentRepository;

    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);

        Map<String, Object> attributes = user.getAttributes();
        Student newStudent = Student
                .builder()
                .student_name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .refreshToken(this.generateRefreshToken((String) attributes.get("email")))
                .avatar((String) attributes.get("picture"))
                .isEnabled(true)
                .build();
        LoginOuth2(newStudent);

        return user;
    }

    public void LoginOuth2(Student student){
        boolean sdt = studentRepository.findByEmail(student.getEmail()).isPresent();
        if(!sdt) {
            studentRepository.save(student);
        }
    }

    public  String generateRefreshToken(String email){
        return String.valueOf(UUID.nameUUIDFromBytes(email.getBytes()));
    }

}
