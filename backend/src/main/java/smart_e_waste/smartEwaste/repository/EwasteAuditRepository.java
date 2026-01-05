package smart_e_waste.smartEwaste.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smart_e_waste.smartEwaste.entity.EwasteAudit;

@Repository
public interface EwasteAuditRepository extends JpaRepository<EwasteAudit, Long> {
    
    List<EwasteAudit> findByEmailOrderByDateDesc(String email);
    List<EwasteAudit> findByStatus(String status);
    List<EwasteAudit> findByPickupPersonnelIdOrderByDateDesc(Long pickupPersonnelId);
}
