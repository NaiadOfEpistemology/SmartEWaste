package smart_e_waste.smartEwaste.service;

import smart_e_waste.smartEwaste.dto.UserDto;
import smart_e_waste.smartEwaste.entity.User;
import smart_e_waste.smartEwaste.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {
    private final UserRepository repo;
    private final FileStorageService storage;
    public UserService(UserRepository repo, FileStorageService storage) {
        this.repo=repo;
        this.storage=storage;
    }
    public User getProfile(String email){
        return repo.findByEmail(email);
    }
    public User updateProfile(String email, String fullName, String phone, String profilePhoto){
        User u=repo.findByEmail(email);
        u.setFullName(fullName);
        u.setPhone(phone);
        if(profilePhoto != null && !profilePhoto.isEmpty()) u.setProfilePhoto(profilePhoto);
        return repo.save(u);
    }
    

    public User updatePhoto(String email, MultipartFile photo) throws Exception {
        User u=repo.findByEmail(email);
        if(u == null) throw new RuntimeException("User not found");
    
        String saved=storage.save(photo, "profile");
        String url="/uploads/profile/" + saved;
    
        u.setProfilePhoto(url);
        return repo.save(u);
    }

}
