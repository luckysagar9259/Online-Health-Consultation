package com.example.controller.demo.entity;

public class Patient extends User {

    @Override
    public String getUserType() {
        return "Patient";
    }
}