package smart_e_waste.smartEwaste.service;

import smart_e_waste.smartEwaste.dto.*;
import smart_e_waste.smartEwaste.entity.User;
import smart_e_waste.smartEwaste.entity.Role;
import smart_e_waste.smartEwaste.repository.UserRepository;
import smart_e_waste.smartEwaste.util.JwtUtil;
import smart_e_waste.smartEwaste.util.PasswordValidator;
import smart_e_waste.smartEwaste.util.EmailValidator;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Random;

@Service
public class AuthService {

    private final UserRepository repo;
    private final JwtUtil jwt;
    private final EmailService emailService;
    private final PasswordEncoder encoder;

    public AuthService(UserRepository repo,
                       JwtUtil jwt,
                       EmailService emailService,
                       PasswordEncoder encoder) {
        this.repo=repo;
        this.jwt=jwt;
        this.emailService=emailService;
        this.encoder=encoder;
    }

    public UserDto register(RegisterRequest req) {
        String email=req.getEmail().trim().toLowerCase();
        String password=req.getPassword();

        if(!EmailValidator.isValid(email)){
            throw new RuntimeException("INVALID_EMAIL");
        }
        if(!PasswordValidator.isValid(password)){
            throw new RuntimeException("WEAK_PASSWORD");
        }
        if(repo.findByEmail(email)!=null){
            throw new RuntimeException("ACCOUNT_EXISTS");
        }

        User u=new User();
        u.setEmail(email);
        u.setPassword(encoder.encode(password));
        u.setFullName(req.getFullName());
        u.setPhone(req.getPhone());
        u.setRole(Role.USER);

        String otp=String.valueOf(new Random().nextInt(900000)+100000);
        u.setVerificationCode(otp);
        repo.save(u);

        emailService.sendOtpEmail(email,otp);

        UserDto dto=new UserDto();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setFullName(u.getFullName());
        return dto;
    }

    public boolean verifyOtp(VerifyRequest req) {
        User u=repo.findByEmail(req.getEmail().trim().toLowerCase());
        if(u==null) return false;
        if(!req.getOtp().equals(u.getVerificationCode())) return false;

        u.setVerified(true);
        u.setVerificationCode(null);
        repo.save(u);
        return true;
    }

    public LoginResponse login(String email,String password) {

        email=email.trim().toLowerCase();
        User u=repo.findByEmail(email);

        if(u==null) throw new RuntimeException("User not found");
        if(!u.isVerified() && u.getRole()==Role.USER)
            throw new RuntimeException("UNVERIFIED");

        System.out.println("raw pwd = "+password);
        System.out.println("db hash = "+u.getPassword());
        System.out.println("match = "+encoder.matches(password,u.getPassword()));

        if(!encoder.matches(password,u.getPassword()))
            throw new RuntimeException("Wrong password");

        LoginResponse r=new LoginResponse();
        r.setToken(jwt.generateToken(email));
        r.setRole(u.getRole().name());
        r.setFullName(u.getFullName());
        r.setEmail(u.getEmail());
        return r;
    }

    public void resendOtp(String email) {
        User u=repo.findByEmail(email.trim().toLowerCase());
        if(u==null) throw new RuntimeException("NOT_FOUND");

        String otp=String.valueOf(new Random().nextInt(900000)+100000);
        u.setVerificationCode(otp);
        repo.save(u);

        emailService.sendOtpEmail(email,otp);
    }

    public void resetPassword(ResetPasswordRequest req) {
        User u=repo.findByEmail(req.getEmail().trim().toLowerCase());
        if(u==null) throw new RuntimeException("Email not found");

        u.setPassword(encoder.encode(req.getNewPassword()));
        repo.save(u);
    }
}