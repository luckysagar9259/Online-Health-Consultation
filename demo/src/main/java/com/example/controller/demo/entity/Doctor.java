package com.example.controller.demo.entity;

public class Doctor extends User {

    @Override
    public String getUserType() {
        return "Doctor";
    }
}