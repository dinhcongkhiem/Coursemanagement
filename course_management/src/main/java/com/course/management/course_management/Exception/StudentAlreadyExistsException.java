package com.course.management.course_management.Exception;

public class StudentAlreadyExistsException extends RuntimeException{
    public StudentAlreadyExistsException(String message){
        super(message);
    }
}
