package com.example.controller.demo.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AppointmentJDBC {

    public void insertAppointment(
            String doctorName,
            String appointmentDate,
            String appointmentTime,
            String reason,
            String patientEmail) {

        String sql = "INSERT INTO appointment " +
                "(doctor_name, appointment_date, appointment_time, reason, patient_email) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, doctorName);
            statement.setString(2, appointmentDate);
            statement.setString(3, appointmentTime);
            statement.setString(4, reason);
            statement.setString(5, patientEmail);

            statement.executeUpdate();

            System.out.println("Appointment inserted successfully!");

        } catch (Exception e) {
            System.out.println("Appointment insertion failed!");
            e.printStackTrace();
        }
    }

    public void getAllAppointments() {

        String sql = "SELECT * FROM appointment";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {

                System.out.println(
                        "ID: " + resultSet.getInt("id")
                );

                System.out.println(
                        "Doctor: " + resultSet.getString("doctor_name")
                );

                System.out.println(
                        "Date: " + resultSet.getString("appointment_date")
                );

                System.out.println(
                        "Time: " + resultSet.getString("appointment_time")
                );

                System.out.println(
                        "Reason: " + resultSet.getString("reason")
                );

                System.out.println(
                        "Patient Email: " +
                        resultSet.getString("patient_email")
                );

                System.out.println("-------------------------");
            }

        } catch (Exception e) {
            System.out.println("Unable to fetch appointments!");
            e.printStackTrace();
        }
    }
}