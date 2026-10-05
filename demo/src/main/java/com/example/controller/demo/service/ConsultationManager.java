package com.example.controller.demo.service;

public class ConsultationManager {

    private int activeConsultations = 0;

    public synchronized void startConsultation() {

        activeConsultations++;

        System.out.println(
                "Active consultations: " + activeConsultations
        );

        activeConsultations--;
    }
}