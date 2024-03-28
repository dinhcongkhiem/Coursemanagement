package com.course.management.course_management.Service;

import com.course.management.course_management.Exception.ProgramCodeAlreadyExistsException;
import com.course.management.course_management.Exception.StudentAlreadyExistsException;
import com.course.management.course_management.Model.Courses;
import com.course.management.course_management.Repository.CoursesRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CourseService {
    private final CoursesRepository coursesRepository;
    public void createCourse(Courses courses){

        Optional<Courses> c = coursesRepository.findByProgramCode(courses.getProgramCode());
        if (c.isPresent()) {
            throw new ProgramCodeAlreadyExistsException(
                    "Course with code " + courses.getProgramCode() + " already exists"
            );
        }

        Courses newCourses = Courses.builder()
                .name(courses.getName())
                .duration(courses.getDuration())
                .programCode(courses.getProgramCode())
                .studyLoad(courses.getStudyLoad())
                .build();
        coursesRepository.save(newCourses);



    }

    public List<Courses> getAllCourses(){
        return coursesRepository.findAll();
    }
}
