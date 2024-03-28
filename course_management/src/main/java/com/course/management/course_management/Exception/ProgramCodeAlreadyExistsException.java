package com.course.management.course_management.Exception;

public class ProgramCodeAlreadyExistsException extends RuntimeException{
    public ProgramCodeAlreadyExistsException(String message){
        super(message);
    }
}