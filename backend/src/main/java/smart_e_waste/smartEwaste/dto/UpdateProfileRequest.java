package smart_e_waste.smartEwaste.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String email;
    private String fullName;
    private String phone;
    private String profilePhoto;
}
