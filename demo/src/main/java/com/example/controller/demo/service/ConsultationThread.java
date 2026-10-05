package com.example.controller.demo.service;

public class ConsultationThread extends Thread {

    @Override
    public void run() {
        System.out.println("Consultation thread started");

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            System.out.println("Consultation thread interrupted");
        }

        System.out.println("Consultation thread completed");
    }
}