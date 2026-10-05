package com.example.controller.demo.controller;

import com.example.controller.demo.entity.Appointment;
import com.example.controller.demo.repository.AppointmentRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class HealthServlet extends HttpServlet {

    private AppointmentRepository appointmentRepository;

    public HealthServlet(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");

        PrintWriter out = response.getWriter();

        List<Appointment> appointments =
                appointmentRepository.findAll();

        out.println("<html>");
        out.println("<body>");

        out.println("<h1>Online Health Consultation Platform</h1>");
        out.println("<h2>Appointments</h2>");

        for (Appointment appointment : appointments) {

            out.println("<p>");
            out.println("Doctor: " + appointment.getDoctorName());
            out.println("<br>");
            out.println("Patient Email: " + appointment.getPatientEmail());
            out.println("<br>");
            out.println("Date: " + appointment.getAppointmentDate());
            out.println("<br>");
            out.println("Time: " + appointment.getAppointmentTime());
            out.println("</p>");

            out.println("<hr>");
        }

        out.println("</body>");
        out.println("</html>");
    }
}