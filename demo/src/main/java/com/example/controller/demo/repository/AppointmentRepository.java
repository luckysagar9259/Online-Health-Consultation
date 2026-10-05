package com.example.controller.demo.repository;

import com.example.controller.demo.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Optional<List<Appointment>> findByPatientEmail(String patientEmail);
}