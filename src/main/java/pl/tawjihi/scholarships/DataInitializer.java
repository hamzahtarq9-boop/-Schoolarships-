package pl.tawjihi.scholarships;

import pl.tawjihi.scholarships.entity.AdminUser;
import pl.tawjihi.scholarships.repository.AdminUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(AdminUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            AdminUser admin = userRepository.findByUsername("admin").orElse(new AdminUser());
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("ChangeMe123!"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println(">>> ADMIN USER SECURED & SAVED SUCCESSFULLY! <<<");
        };
    }
}