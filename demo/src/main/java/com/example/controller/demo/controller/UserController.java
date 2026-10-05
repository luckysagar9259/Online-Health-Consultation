package com.example.controller.demo.controller;

import java.util.List;
import com.example.controller.demo.entity.User;
import com.example.controller.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {

        User existingUser = userRepository
                .findByEmail(user.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Email not registered"));

        if (!existingUser.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return existingUser;
    }

    @GetMapping("/doctors")
public List<User> getDoctors() {

    return userRepository.findByRoleIgnoreCase("doctor");
}

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    @PutMapping("/doctor-profile")
    public User updateDoctorProfile(@RequestBody User updatedUser) {

        User existingUser = userRepository
                .findByEmail(updatedUser.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        existingUser.setSpecialization(
                updatedUser.getSpecialization()
        );

        existingUser.setExperience(
                updatedUser.getExperience()
        );

        existingUser.setQualification(
                updatedUser.getQualification()
        );

        existingUser.setConsultationFee(
                updatedUser.getConsultationFee()
        );

        existingUser.setAvailability(
                updatedUser.getAvailability()
        );

        return userRepository.save(existingUser);
    }
}