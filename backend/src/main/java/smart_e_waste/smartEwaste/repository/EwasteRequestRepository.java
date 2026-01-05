package smart_e_waste.smartEwaste.repository;

import smart_e_waste.smartEwaste.entity.EwasteRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EwasteRequestRepository extends JpaRepository<EwasteRequest, Long> {

    List<EwasteRequest> findByEmailOrderByRequestDateDesc(String email);
    long countByPickupPersonnelIdAndStatus(Long pickupPersonnelId, String status);
    List<EwasteRequest> findByPickupPersonnelIdAndStatus(Long pickupPersonnelId, String status);
    List<EwasteRequest> findByStatus(String status);
}