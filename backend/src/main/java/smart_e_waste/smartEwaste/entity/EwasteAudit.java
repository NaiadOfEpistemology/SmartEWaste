package smart_e_waste.smartEwaste.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name="ewaste_audit")
@Data
public class EwasteAudit {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="request_id")
    private Long requestId;

    private String email;
    private String wasteType;
    private String description;
    private String image;
    private String status;  
    private String date; 
    private String contact;
    private String location;
    private String pickupDate;
    @Column(name="rejection_reason")
    private String rejectionReason;
    @Column(name="pickup_personnel")
    private String pickupPersonnel; 
    @Column(name="pickup_personnel_id")
    private Long pickupPersonnelId;


}
