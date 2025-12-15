package smart_e_waste.smartEwaste.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import smart_e_waste.smartEwaste.entity.Role;
import smart_e_waste.smartEwaste.entity.User;
import smart_e_waste.smartEwaste.repository.UserRepository;

@Configuration
public class AdminInitializer {

    private final PasswordEncoder encoder;

    public AdminInitializer(PasswordEncoder encoder){
        this.encoder=encoder;
    }

    @Bean
    CommandLineRunner initAdmin(UserRepository repo) {
        return args -> {
            if(!repo.existsByEmail("admin@ewaste.com")) {
                User admin=new User();
                admin.setFullName("Admin");
                admin.setEmail("admin@ewaste.com");
                admin.setPassword(encoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                admin.setVerified(true);
                admin.setPhone("9999999999");
                repo.save(admin);
                System.out.println("default admin");
            }
        };
    }
}