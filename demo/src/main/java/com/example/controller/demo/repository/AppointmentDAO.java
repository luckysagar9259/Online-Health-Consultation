package com.example.controller.demo.repository;

import com.example.controller.demo.entity.Appointment;
import java.util.List;

public class AppointmentDAO {

    private final AppointmentRepository appointmentRepository;

    public AppointmentDAO(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment saveAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}