package smart_e_waste.smartEwaste.service;

import smart_e_waste.smartEwaste.entity.EwasteRequest;
import smart_e_waste.smartEwaste.repository.EwasteRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EwasteService {

    private final EwasteRequestRepository repo;
    private final FileStorageService storage;

    public EwasteService(EwasteRequestRepository repo, FileStorageService storage){
        this.repo=repo;
        this.storage=storage;
    }

    public EwasteRequest create(
        String email,
        String wasteType,
        String brand,
        String model,
        String condition,
        int quantity,
        String remarks,
        String description,
        MultipartFile image,
        String contact,
        String pickupDate,
        String location
) throws Exception {

    String savedImage=(image != null && !image.isEmpty())
            ? storage.save(image, "requests")
            : null;

    EwasteRequest r=new EwasteRequest();
    r.setEmail(email);
    r.setWasteType(wasteType);
    r.setBrand(brand);
    r.setModel(model);
    r.setCondition(condition);
    r.setQuantity(quantity);
    r.setRemarks(remarks);
    r.setDescription(description);
    r.setImage(savedImage);

    r.setContact(contact);
    r.setPickupDate(pickupDate);
    r.setLocation(location);

    r.setRequestDate(LocalDateTime.now());
    r.setStatus("PENDING");
    r.setPickedUp(false);

    return repo.save(r);
}

    public List<EwasteRequest> userRequests(String email){
        return repo.findByEmailOrderByRequestDateDesc(email);
    }
}