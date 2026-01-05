package smart_e_waste.smartEwaste.controller;

import smart_e_waste.smartEwaste.dto.*;
import smart_e_waste.smartEwaste.entity.Personnel;
import smart_e_waste.smartEwaste.entity.User;
import smart_e_waste.smartEwaste.entity.EwasteRequest;
import smart_e_waste.smartEwaste.service.AuthService;
import smart_e_waste.smartEwaste.service.UserService;
import smart_e_waste.smartEwaste.repository.EwasteRequestRepository;
import smart_e_waste.smartEwaste.repository.PersonnelRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;
    private final UserService userService;
    private final PersonnelRepository personnelRepo;
    private final EwasteRequestRepository requestRepo;

    public AuthController(AuthService auth, UserService userService,
                          PersonnelRepository personnelRepo,
                          EwasteRequestRepository requestRepo) {
        this.auth = auth;
        this.userService = userService;
        this.personnelRepo = personnelRepo;
        this.requestRepo = requestRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            return ResponseEntity.ok(auth.register(req));
        } catch (RuntimeException e) {
            switch (e.getMessage()) {
                case "ACCOUNT_EXISTS":
                    return ResponseEntity.status(400).body("Account already exists.");
                case "WEAK_PASSWORD":
                    return ResponseEntity.status(400).body("Weak password. Minimum 6 chars, 1 uppercase, 1 special character required.");
                case "INVALID_EMAIL":
                    return ResponseEntity.status(400).body("Invalid email. Only Gmail & Yahoo supported, username must be at least 2 characters.");
                default:
                    return ResponseEntity.status(500).body("Registration failed");
            }
        }
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    String email = req.getEmail().trim().toLowerCase();
    String password = req.getPassword().trim();

   
    if ("admin@ewaste.com".equals(email) && "Admin@123".equals(password)) {
        Map<String, String> res = new HashMap<>();
        res.put("role", "ADMIN");
        res.put("redirect", "/admin");
        res.put("name", "Admin");
        res.put("email", email);
        return ResponseEntity.ok(res);
    }

    
    Personnel personnel = personnelRepo.findByEmail(email);
    if (personnel != null) {
        String expectedPassword = "Personnel@" + personnel.getName();
        if (expectedPassword.equals(password)) {
            Map<String, String> res = new HashMap<>();
            res.put("role", "PERSONNEL");
            res.put("redirect", "/personneldashboard");
            res.put("name", personnel.getName());
            res.put("email", personnel.getEmail());
            return ResponseEntity.ok(res);
        }
    }

 
    try {
        LoginResponse userResp = auth.login(email, password);
        Map<String, String> res = new HashMap<>();
        res.put("role", userResp.getRole()); 
        res.put("redirect", "/dashboard");
        res.put("name", userResp.getFullName());
        res.put("email", userResp.getEmail());
        res.put("token", userResp.getToken());
        return ResponseEntity.ok(res);
    } catch (RuntimeException e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }
}




    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyRequest req) {
        boolean ok = auth.verifyOtp(req);
        return ok ? ResponseEntity.ok("Verified") : ResponseEntity.status(400).body("Invalid OTP");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody VerifyRequest req) {
        try {
            auth.resendOtp(req.getEmail());
            return ResponseEntity.ok("OTP sent.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Email not found.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody VerifyRequest req) {
        try {
            auth.resendOtp(req.getEmail());
            return ResponseEntity.ok("OTP sent");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Email not found");
        }
    }

    @PostMapping("/verify-forgot")
    public ResponseEntity<?> verifyForgot(@RequestBody VerifyRequest req) {
        boolean ok = auth.verifyOtp(req);
        return ok ? ResponseEntity.ok("OTP Verified") : ResponseEntity.status(400).body("Invalid OTP");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        try {
            auth.resetPassword(req);
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/personnel-login")
    public ResponseEntity<?> personnelLogin(@RequestBody LoginRequest req) {
        Personnel personnel = personnelRepo.findByEmail(req.getEmail().trim().toLowerCase());
        if (personnel == null) return ResponseEntity.status(400).body("Personnel not found");

        String expectedPassword = "Personnel@" + personnel.getName();
        if (!req.getPassword().equals(expectedPassword))
            return ResponseEntity.status(400).body("Invalid password");

        Map<String, String> res = new HashMap<>();
        res.put("role", "PERSONNEL");
        res.put("redirect", "/personneldashboard");
        res.put("name", personnel.getName());
        res.put("email", personnel.getEmail());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/personnel/requests")
public ResponseEntity<?> getPersonnelRequests(@RequestParam String email) {

    Personnel p = personnelRepo.findByEmail(email);

    if (p == null) {
        return ResponseEntity.badRequest().body("Personnel not found");
    }

    List<EwasteRequest> requests =
            requestRepo.findByPickupPersonnelIdAndStatus(
                    p.getId(),    
                    "ACCEPTED"     
            );

    return ResponseEntity.ok(requests);
}

}
