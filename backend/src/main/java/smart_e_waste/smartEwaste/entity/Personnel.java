package smart_e_waste.smartEwaste.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name="ewaste_personnel")
@Data
public class Personnel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;     
    private String email;    
}

