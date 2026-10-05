package com.example.controller.demo.repository;

public class AppointmentJDBCTest {

    public static void main(String[] args) {

        AppointmentJDBC jdbc = new AppointmentJDBC();

        jdbc.insertAppointment(
                "Dr. Sharma",
                "2026-09-30",
                "10:30:00",
                "General consultation",
                "test@gmail.com"
        );

        System.out.println("\nAll Appointments:");

        jdbc.getAllAppointments();
    }
}