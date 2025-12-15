package smart_e_waste.smartEwaste.controller;

import smart_e_waste.smartEwaste.dto.*;
import smart_e_waste.smartEwaste.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;
    private final UserService userService;

    public AuthController(AuthService auth, UserService userService) {
        this.auth=auth;
        this.userService=userService;
    }

    @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
    try{
        return ResponseEntity.ok(auth.register(req));
    }
    catch(RuntimeException e){
        if("ACCOUNT_EXISTS".equals(e.getMessage())){
            return ResponseEntity.status(400).body("Account already exists.");
        }
        if("WEAK_PASSWORD".equals(e.getMessage())){
            return ResponseEntity.status(400).body("Weak password. Minimum 6 chars, 1 uppercase, 1 special character required.");
        }
        if ("INVALID_EMAIL".equals(e.getMessage())) {
            return ResponseEntity.status(400).body("Invalid email. Only Gmail & Yahoo supported, username must be at least 2 characters.");
        }
        return ResponseEntity.status(500).body("Registration failed");
    }
}


@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req){
    LoginResponse r=auth.login(req.getEmail(), req.getPassword());
    return ResponseEntity.ok(r);
}


    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyRequest req){
        boolean ok=auth.verifyOtp(req);
        if(ok) return ResponseEntity.ok("Verified");
        return ResponseEntity.status(400).body("Invalid OTP");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody VerifyRequest req){
        try{
            auth.resendOtp(req.getEmail());
            return ResponseEntity.ok("OTP sent.");
        }
        catch (Exception e){
            return ResponseEntity.status(400).body("Email not found.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody VerifyRequest req){
        try {
            auth.resendOtp(req.getEmail());
            return ResponseEntity.ok("OTP sent");
        } catch (Exception e){
            return ResponseEntity.status(400).body("Email not found");
        }
    }

    @PostMapping("/verify-forgot")
    public ResponseEntity<?> verifyForgot(@RequestBody VerifyRequest req){
        boolean ok=auth.verifyOtp(req);
        if(ok) return ResponseEntity.ok("OTP Verified");
        return ResponseEntity.status(400).body("Invalid OTP");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req){
        try{
            auth.resetPassword(req);
            return ResponseEntity.ok("Password updated successfully");
        }catch(RuntimeException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
