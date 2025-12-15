package smart_e_waste.smartEwaste.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String email;
    private String fullName;
    private String token;
    private String role;
    
}
