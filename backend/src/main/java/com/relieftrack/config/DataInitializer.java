package com.relieftrack.config;

import com.relieftrack.entity.*;
import com.relieftrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DisasterRepository disasterRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private ReliefRequestRepository reliefRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Users
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@relieftrack.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phone("9876543210")
                    .build();

            User citizen = User.builder()
                    .name("Rajesh Kumar")
                    .email("rajesh@email.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.CITIZEN)
                    .phone("9876543211")
                    .build();

            userRepository.saveAll(Arrays.asList(admin, citizen));

            // Seed Disasters
            Disaster kerala = Disaster.builder()
                    .name("Kerala Floods 2024")
                    .type("Flood")
                    .location("Kerala, India")
                    .date(LocalDate.of(2024, 6, 15))
                    .severity("HIGH")
                    .description("Severe flooding across multiple districts due to heavy monsoon rains.")
                    .status("ACTIVE")
                    .build();

            Disaster cyclone = Disaster.builder()
                    .name("Odisha Cyclone Remal")
                    .type("Cyclone")
                    .location("Odisha, India")
                    .date(LocalDate.of(2024, 5, 27))
                    .severity("CRITICAL")
                    .description("Cyclone Remal made landfall causing widespread destruction.")
                    .status("ACTIVE")
                    .build();

            Disaster landslide = Disaster.builder()
                    .name("Uttarakhand Landslide")
                    .type("Landslide")
                    .location("Uttarakhand, India")
                    .date(LocalDate.of(2024, 8, 2))
                    .severity("HIGH")
                    .description("Multiple landslides triggered by heavy rainfall blocked highways.")
                    .status("ACTIVE")
                    .build();

            Disaster earthquake = Disaster.builder()
                    .name("Gujarat Earthquake")
                    .type("Earthquake")
                    .location("Gujarat, India")
                    .date(LocalDate.of(2024, 3, 10))
                    .severity("MEDIUM")
                    .description("Magnitude 5.2 earthquake caused structural damage.")
                    .status("RESOLVED")
                    .build();

            disasterRepository.saveAll(Arrays.asList(kerala, cyclone, landslide, earthquake));

            // Seed Resources
            Resource rice = Resource.builder()
                    .name("Rice (50kg bags)")
                    .category("Food")
                    .quantity(500)
                    .availableStock(320)
                    .build();

            Resource water = Resource.builder()
                    .name("Drinking Water (20L)")
                    .category("Water")
                    .quantity(2000)
                    .availableStock(1400)
                    .build();

            Resource medicines = Resource.builder()
                    .name("Paracetamol Tablets")
                    .category("Medicines")
                    .quantity(10000)
                    .availableStock(7200)
                    .build();

            Resource tents = Resource.builder()
                    .name("Emergency Tents (Family)")
                    .category("Tents")
                    .quantity(400)
                    .availableStock(55)
                    .build();

            resourceRepository.saveAll(Arrays.asList(rice, water, medicines, tents));

            // Seed Relief Request
            ReliefRequest req = ReliefRequest.builder()
                    .user(citizen)
                    .disaster(kerala)
                    .location("Thrissur, Kerala")
                    .peopleAffected(5)
                    .resourcesNeeded("Food, Water, Blankets")
                    .priority("HIGH")
                    .status("APPROVED")
                    .notes("Elderly members need medicines")
                    .allocatedResources("Rice x5, Water x10")
                    .build();

            reliefRequestRepository.save(req);

            System.out.println("🌱 Database initialized with sample data.");
        }
    }
}
