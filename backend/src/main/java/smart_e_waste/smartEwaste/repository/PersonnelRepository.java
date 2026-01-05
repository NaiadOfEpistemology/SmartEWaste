package smart_e_waste.smartEwaste.repository;

import smart_e_waste.smartEwaste.entity.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PersonnelRepository extends JpaRepository<Personnel, Long> {

    @Query("SELECT p FROM Personnel p WHERE " +
           "(SELECT COUNT(r) FROM EwasteRequest r WHERE r.pickupPersonnel = p.name AND r.status = 'ACCEPTED') < 3")
    List<Personnel> findAvailablePersonnel();

    Personnel findByEmail(String email);

}
