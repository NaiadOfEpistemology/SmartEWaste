package smart_e_waste.smartEwaste.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String fullName;
    private boolean verified=false;
    private String verificationCode;
    private String profilePhoto;
    private String phone;
    private Role role=Role.USER;
}
