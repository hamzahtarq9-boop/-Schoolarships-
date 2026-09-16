package pl.tawjihi.scholarships.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.tawjihi.scholarships.entity.AdminUser;
import pl.tawjihi.scholarships.repository.AdminUserRepository;

// Seeds a default admin account on first boot so the dashboard is reachable immediately.
// CHANGE THE PASSWORD after first login in a real deployment.
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() == 0) {
            AdminUser admin = new AdminUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("ChangeMe123!"));
            admin.setRole("ADMIN");
            adminUserRepository.save(admin);
        }
    }
}
