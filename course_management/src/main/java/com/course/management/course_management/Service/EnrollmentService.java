package com.course.management.course_management.Service;

import com.course.management.course_management.Exception.EnrolmentAlreadyExistsException;
import com.course.management.course_management.Model.Courses;
import com.course.management.course_management.Model.Enrollment;
import com.course.management.course_management.Model.Student;
import com.course.management.course_management.Repository.CoursesRepository;
import com.course.management.course_management.Repository.EnrollmentRepository;
import com.course.management.course_management.Request.EnrollmentRequest;
import com.course.management.course_management.Response.CourseReponse;
import com.course.management.course_management.Response.StudentInCourseResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CoursesRepository coursesRepository;
    private final StudentService studentService;

    public void AddNewCourse(EnrollmentRequest enrollmentRequest) throws EnrolmentAlreadyExistsException {
        Courses courses = coursesRepository.findById(enrollmentRequest.getCourseId()).orElseThrow();
        Student student = studentService.getCurrentStudent();


        Optional<Enrollment> enrollment = enrollmentRepository.findByCourseAndStudent(courses, student);
        if(enrollment.isPresent()){
            throw new EnrolmentAlreadyExistsException(
                    "You have registered for this course"
            );
        }
        Enrollment newenrollment = Enrollment.builder()
            .course(courses)
            .student(student)
            .desiredScore(enrollmentRequest.getDesiredScore())
            .note(enrollmentRequest.getNote())
            .build();

        enrollmentRepository.save(newenrollment);

    }

    public List<CourseReponse> getAllEnrollments(){
        Student student = studentService.getCurrentStudent();
        return enrollmentRepository.findByStudent(student);
    }

    public Enrollment updateEnrollments(EnrollmentRequest enrollmentRequest){
        Enrollment enrollment = enrollmentRepository.findById(enrollmentRequest.getId()).orElseThrow();
        enrollment.setDesiredScore(enrollmentRequest.getDesiredScore());
        enrollment.setNote(enrollmentRequest.getNote());
        enrollmentRepository.save(enrollment);
        return enrollment;
    }

    public void removeEnrollments(Long id){
        Enrollment enrollment = enrollmentRepository.findById(id).orElseThrow();
        enrollmentRepository.delete(enrollment);
    }

    public  List<StudentInCourseResponse> getListStudent(Long courseId){
        Courses course = coursesRepository.findById(courseId).orElseThrow();

        List<Enrollment> enrollments = enrollmentRepository.findByCourse(course);
        Long currentStudentId = studentService.getCurrentStudent().getId();
        return enrollments.stream()
                .filter(e -> (!Objects.equals(e.getStudent().getId(), currentStudentId)))
                .map(e -> StudentInCourseResponse.builder()
                        .studentId(e.getStudent().getId())
                        .studentName(e.getStudent().getStudent_name())
                        .avatar(e.getStudent().getAvatar())
                        .desiredScore(e.getDesiredScore())
                        .note(e.getNote())
                        .build())
                .collect(Collectors.toList());
    }

    public List<List<StudentInCourseResponse>> getStudentInAllCourse(){
        List<List<StudentInCourseResponse>> listStudentInALlCourse = new ArrayList<>();
        for (CourseReponse courseReponse: this.getAllEnrollments()) {
            listStudentInALlCourse.add(getListStudent(courseReponse.getCourse().getId()));
        }
        return listStudentInALlCourse;
    }
}
