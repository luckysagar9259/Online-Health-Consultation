package com.example.controller.demo.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SignalingController {

    @MessageMapping("/signal")
    @SendTo("/topic/signal")
    public String sendSignal(String message) {
        return message;
    }
}