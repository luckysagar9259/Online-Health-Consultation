package com.example.controller.demo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.controller.demo.entity.Appointment;
import com.example.controller.demo.entity.User;
import com.example.controller.demo.exception.AppointmentNotFoundException;
import com.example.controller.demo.repository.AppointmentRepository;
import com.example.controller.demo.repository.UserRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository) {

        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/book")
    public Appointment bookAppointment(
            @RequestBody Appointment appointment) {

        return appointmentRepository.save(appointment);
    }

    @GetMapping("/patient/{email}")
    public List<Appointment> getPatientAppointments(
            @PathVariable String email) {

        return appointmentRepository.findByPatientEmail(email)
                .orElseThrow(() ->
                        new AppointmentNotFoundException(
                                "No appointments found"));
    }

    @GetMapping("/doctor")
    public List<Map<String, Object>> getDoctorAppointments() {

        List<Appointment> appointments =
                appointmentRepository.findAll();

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Appointment appointment : appointments) {

            Map<String, Object> data =
                    new HashMap<>();

            data.put("id", appointment.getId());
            data.put("doctorName",
                    appointment.getDoctorName());
            data.put("appointmentDate",
                    appointment.getAppointmentDate());
            data.put("appointmentTime",
                    appointment.getAppointmentTime());
            data.put("reason",
                    appointment.getReason());
            data.put("patientEmail",
                    appointment.getPatientEmail());
            data.put("status",
                    appointment.getStatus());

            User patient = userRepository
                    .findByEmail(appointment.getPatientEmail())
                    .orElse(null);

            if (patient != null) {
                data.put("patientName",
                        patient.getFullName());
            } else {
                data.put("patientName",
                        "Unknown Patient");
            }

            result.add(data);
        }

        return result;
    }

    @PutMapping("/{id}/status")
    public Appointment updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new AppointmentNotFoundException(
                                        "Appointment not found"));

        appointment.setStatus(status);

        return appointmentRepository.save(appointment);
    }
}