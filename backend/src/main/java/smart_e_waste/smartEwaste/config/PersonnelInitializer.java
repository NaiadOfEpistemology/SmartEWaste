package smart_e_waste.smartEwaste.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import smart_e_waste.smartEwaste.entity.Personnel;
import smart_e_waste.smartEwaste.repository.PersonnelRepository;


@Configuration
public class PersonnelInitializer {

    @Bean
    CommandLineRunner initPersonnel(PersonnelRepository repo) {
        return args -> {
            if (repo.count() == 0) { 
                String[][] defaults = {
                    {"dustcat", "dustcat@ewaste.com"},
                    {"trashpanda", "trashpanda@ewaste.com"},
                    {"zbock", "zbock@ewaste.com"}
                };
                for (String[] p : defaults) {
                    Personnel person = new Personnel();
                    person.setName(p[0]);
                    person.setEmail(p[1]);
                    repo.save(person);
                }
                System.out.println("Default personnel created");
            }
        };
    }
}


