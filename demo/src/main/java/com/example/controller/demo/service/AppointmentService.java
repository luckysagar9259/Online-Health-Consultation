package com.example.controller.demo.service;

import com.example.controller.demo.entity.Appointment;

import java.util.ArrayList;
import java.util.List;

public class AppointmentService {

    private List<Appointment> appointments = new ArrayList<>();

    public void addAppointment(Appointment appointment) {
        appointments.add(appointment);
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }
}