package com.example.controller.demo.controller;

import com.example.controller.demo.repository.AppointmentRepository;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServletConfig {

    @Bean
    public ServletRegistrationBean<HealthServlet> healthServlet(
            AppointmentRepository appointmentRepository) {

        HealthServlet servlet =
                new HealthServlet(appointmentRepository);

        ServletRegistrationBean<HealthServlet> registration =
                new ServletRegistrationBean<>(
                        servlet,
                        "/health"
                );

        registration.setName("HealthServlet");

        return registration;
    }
}