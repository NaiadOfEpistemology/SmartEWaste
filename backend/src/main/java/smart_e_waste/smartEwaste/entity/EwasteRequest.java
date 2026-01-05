package smart_e_waste.smartEwaste.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name="ewaste_requests")
@Data
public class EwasteRequest {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String wasteType;
    private String description;
    private String image;
    private LocalDateTime requestDate;
    private String status;
    private boolean pickedUp;
    private String contactNumber;
    private String pickupDate;
    private String contact;
    private String location;
    private String brand;
    private String model;
    @Column(name="`condition`")
    private String condition;
    private int quantity;
    private String remarks;
    @Column(name = "rejection_reason")
    private String rejectionReason;
    @Column(name="pickup_personnel")
    private String pickupPersonnel; 

}
