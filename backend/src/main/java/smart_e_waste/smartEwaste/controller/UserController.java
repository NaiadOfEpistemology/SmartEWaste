package smart_e_waste.smartEwaste.controller;

import smart_e_waste.smartEwaste.dto.UpdateProfileRequest;
import smart_e_waste.smartEwaste.entity.User;
import smart_e_waste.smartEwaste.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService service;

    public UserController(UserService service){
        this.service=service;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam String email){
        return ResponseEntity.ok(service.getProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> update(@RequestBody UpdateProfileRequest req){
        return ResponseEntity.ok(
            service.updateProfile(
                req.getEmail(),
                req.getFullName(),
                req.getPhone(),
                req.getProfilePhoto()
            )
        );
    }

    @PostMapping("/photo")
    public ResponseEntity<?> uploadPhoto(
            @RequestParam("email") String email,
            @RequestParam("photo") MultipartFile photo
    ) throws Exception {
        User u=service.updatePhoto(email, photo);
        return ResponseEntity.ok(u.getProfilePhoto());
    }
}
