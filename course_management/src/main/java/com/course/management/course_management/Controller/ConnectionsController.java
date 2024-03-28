package com.course.management.course_management.Controller;

import com.course.management.course_management.Model.Connections;
import com.course.management.course_management.Request.ConnectionsRequest;
import com.course.management.course_management.Service.ConnectionsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/connection")
public class ConnectionsController {
    private final ConnectionsService connectionsService;
    @PostMapping
    public ResponseEntity<?> ConnectionRequest(@RequestBody ConnectionsRequest connection){
        try{
            Connections connections = connectionsService.createConnection(connection);
            return ResponseEntity.ok(connections);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("receiverId not found");

        }
    }

    @GetMapping
    public ResponseEntity<?> getListStudentInConnections(){
        return ResponseEntity.ok().body(connectionsService.getListStudentInConnections());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getConnections(){
        return ResponseEntity.ok().body(connectionsService.getConnections());
    }

}
