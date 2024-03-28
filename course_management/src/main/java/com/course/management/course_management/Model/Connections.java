package com.course.management.course_management.Model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Connections {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "sender")
    private Student sender;
    @ManyToOne
    @JoinColumn(name = "receiver")
    private Student receiver;

    private boolean isConnected  = false;

}
