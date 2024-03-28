package com.course.management.course_management.Controller;

import com.course.management.course_management.Exception.ProgramCodeAlreadyExistsException;
import com.course.management.course_management.Model.Courses;
import com.course.management.course_management.Service.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/course")
public class CourseController {
    private final CourseService courseService;

    @PostMapping("/create")
    public ResponseEntity<String> createCourse(@RequestBody Courses courses) {
        try{
            courseService.createCourse(courses);
            return ResponseEntity.ok("Successfully");
        }catch (ProgramCodeAlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course with code " + courses.getProgramCode() + " already exists");
        }


    }

    @GetMapping("/get")
    public ResponseEntity<List<Courses>> getAllCourse(){
        return ResponseEntity.ok(courseService.getAllCourses());
    }
}
