package smart_e_waste.smartEwaste.controller;

import smart_e_waste.smartEwaste.dto.HistoryResponse;
import smart_e_waste.smartEwaste.entity.EwasteAudit;
import smart_e_waste.smartEwaste.entity.EwasteRequest;
import smart_e_waste.smartEwaste.entity.Personnel;
import smart_e_waste.smartEwaste.repository.EwasteAuditRepository;
import smart_e_waste.smartEwaste.repository.EwasteRequestRepository;
import smart_e_waste.smartEwaste.repository.PersonnelRepository;
import smart_e_waste.smartEwaste.service.EmailService;
import smart_e_waste.smartEwaste.service.EwasteService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class EwasteController {

    private final EwasteService service;
    private final EwasteRequestRepository requestRepo;
    private final EwasteAuditRepository auditRepo;
    private final EmailService emailService;
    private final PersonnelRepository personnelRepo;

    public EwasteController(EwasteService service,
                            EwasteRequestRepository requestRepo,
                            EwasteAuditRepository auditRepo,
                            EmailService emailService,
                            PersonnelRepository personnelRepo) {
        this.service = service;
        this.requestRepo = requestRepo;
        this.auditRepo = auditRepo;
        this.emailService = emailService;
        this.personnelRepo = personnelRepo;
    }

    @PostMapping("/ewaste/create")
    public ResponseEntity<?> createRequest(
            @RequestParam String email,
            @RequestParam String wasteType,
            @RequestParam String brand,
            @RequestParam String model,
            @RequestParam String condition,
            @RequestParam int quantity,
            @RequestParam String remarks,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam String contact,
            @RequestParam String pickupDate,
            @RequestParam String location) throws Exception {

        EwasteRequest created = service.create(
                email,
                wasteType,
                brand,
                model,
                condition,
                quantity,
                remarks,
                description,
                image,
                contact,
                pickupDate,
                location
        );

        return ResponseEntity.ok(created);
    }

    @GetMapping("/ewaste/my-requests")
    public ResponseEntity<?> getUserRequests(@RequestParam String email) {
        return ResponseEntity.ok(service.userRequests(email));
    }

    @GetMapping("/all")
public ResponseEntity<Map<String, List<?>>> getAllRequests() {
    List<EwasteRequest> pending = requestRepo.findByStatus("PENDING");
    List<EwasteRequest> accepted = requestRepo.findByStatus("ACCEPTED");
    List<EwasteAudit> rejected = auditRepo.findByStatus("REJECTED");

    Map<String, List<?>> result = Map.of(
        "pending", pending,
        "accepted", accepted,
        "rejected", rejected
    );

    return ResponseEntity.ok(result);
}




@PostMapping("/accept/{id}")
public ResponseEntity<?> acceptRequest(
        @PathVariable Long id,
        @RequestParam String pickupDate,
        @RequestParam String pickupTime,
        @RequestParam Long personnelId
) {
    EwasteRequest request = requestRepo.findById(id).orElse(null);
    if (request == null) return ResponseEntity.badRequest().body("Invalid request ID");

    Personnel personnel = personnelRepo.findById(personnelId).orElse(null);
    if (personnel == null) return ResponseEntity.badRequest().body("Invalid personnel ID");

    long activeCount = requestRepo.countByPickupPersonnelIdAndStatus(personnel.getId(), "ACCEPTED");

    if (activeCount >= 3) return ResponseEntity.badRequest().body("Personnel already has 3 active requests");

    request.setStatus("ACCEPTED");
    request.setPickupDate(pickupDate + " " + pickupTime);
    request.setPickupPersonnelId(personnel.getId());   
    request.setPickupPersonnel(personnel.getName()); 
    requestRepo.save(request);

    emailService.sendAcceptanceEmail(
        request.getEmail(),
        request.getWasteType(),
        pickupDate,
        pickupTime,
        personnel.getName(),
        personnel.getEmail()
);

    return ResponseEntity.ok("Request Accepted & Email Sent");
}


@PostMapping("/reject/{id}")
public ResponseEntity<?> rejectRequest(
        @PathVariable Long id,
        @RequestBody(required = false) Map<String, String> body
) {
    EwasteRequest request = requestRepo.findById(id).orElse(null);
    if (request == null) return ResponseEntity.badRequest().body("Invalid ID");

    String reason = (body != null && body.get("reason") != null && !body.get("reason").isBlank())
            ? body.get("reason")
            : "No reason provided";
            emailService.sendRejectionEmail(
                request.getEmail(),
                request.getWasteType(),
                reason
        );
        

    return moveToAudit(request, "REJECTED", reason);
}



@PostMapping("/pickup/{id}")
public ResponseEntity<?> adminPickup(@PathVariable Long id) {
    EwasteRequest request = requestRepo.findById(id).orElse(null);
    if (request == null) return ResponseEntity.badRequest().body("Invalid request ID");

    return moveToAudit(request, "PICKED_UP", null);
}

    @GetMapping("/personnel/requests")
    public ResponseEntity<List<EwasteRequest>> getPersonnelRequests(@RequestParam String personnelEmail) {
        Personnel personnel = personnelRepo.findByEmail(personnelEmail.trim().toLowerCase());
        if (personnel == null) return ResponseEntity.badRequest().build();

        List<EwasteRequest> requests =
    requestRepo.findByPickupPersonnelIdAndStatus(personnel.getId(), "ACCEPTED");

        return ResponseEntity.ok(requests);
    }
    @GetMapping("/personnel/all")
public List<Personnel> getAllPersonnel() {
    return personnelRepo.findAll();
}


    @PostMapping("/personnel/pickup/{id}")
public ResponseEntity<?> personnelPickup(
        @PathVariable Long id,
        @RequestParam String personnelEmail) {

    EwasteRequest request = requestRepo.findById(id).orElse(null);
    if (request == null) 
        return ResponseEntity.badRequest().body("Invalid request ID");

    Personnel personnel = personnelRepo.findByEmail(personnelEmail.trim().toLowerCase());
    if (personnel == null) 
        return ResponseEntity.badRequest().body("Invalid personnel");

    if (!"ACCEPTED".equals(request.getStatus()))
        return ResponseEntity.badRequest().body("Request is not in ACCEPTED status");

    if (!personnel.getId().equals(request.getPickupPersonnelId()))
        return ResponseEntity.badRequest().body("This request is not assigned to you");
    

    return moveToAudit(request, "PICKED_UP", null);
}


    @GetMapping("/personnel/available")
    public ResponseEntity<List<Personnel>> getAvailablePersonnel() {
        List<Personnel> available = personnelRepo.findAvailablePersonnel();
        return ResponseEntity.ok(available);
    }
    @GetMapping("/requests/history")
    public ResponseEntity<?> getUserHistory(@RequestParam String email) {
        email = email.trim().toLowerCase();

        List<EwasteRequest> pending = requestRepo.findByEmailOrderByRequestDateDesc(email);
        List<EwasteAudit> completed = auditRepo.findByEmailOrderByDateDesc(email);

        HistoryResponse response = new HistoryResponse();
        response.setPending(pending);
        response.setCompleted(completed);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/history")
    public ResponseEntity<?> getAdminHistory() {
        List<EwasteRequest> pending = requestRepo.findAll();
        List<EwasteAudit> completed = auditRepo.findAll();

        HistoryResponse response = new HistoryResponse();
        response.setPending(pending);
        response.setCompleted(completed);

        return ResponseEntity.ok(response);
    }
    private ResponseEntity<?> moveToAudit(EwasteRequest request, String status, String rejectionReason) {
        if (!"ACCEPTED".equals(request.getStatus()) && !"REJECTED".equals(status)){
            return ResponseEntity.badRequest().body("Already picked up");
        }
        EwasteAudit audit = new EwasteAudit();
        audit.setRequestId(request.getId());
        audit.setEmail(request.getEmail());
        audit.setWasteType(request.getWasteType());
        audit.setDescription(request.getDescription());
        audit.setImage(request.getImage());
        audit.setStatus(status);
        audit.setContact(request.getContact());
        audit.setLocation(request.getLocation());
        audit.setPickupDate(request.getPickupDate());
        audit.setDate(LocalDate.now().toString());
        audit.setRejectionReason(rejectionReason);
        audit.setPickupPersonnelId(request.getPickupPersonnelId());
        audit.setPickupPersonnel(request.getPickupPersonnel());



        auditRepo.save(audit);
        requestRepo.delete(request);

        return ResponseEntity.ok("Moved to audit: " + status);
    }
    @GetMapping("/personnel/completed")
public ResponseEntity<?> getPersonnelCompleted(@RequestParam String personnelEmail) {
    Personnel personnel = personnelRepo.findByEmail(personnelEmail.trim().toLowerCase());
    if (personnel == null) return ResponseEntity.badRequest().body("Invalid personnel");

    List<EwasteAudit> completed = auditRepo.findByPickupPersonnelIdOrderByDateDesc(personnel.getId());


    return ResponseEntity.ok(completed);
}
@GetMapping("/admin/requests")
public ResponseEntity<?> getAdminRequests() {
    List<EwasteRequest> active = requestRepo.findAll();
    List<EwasteAudit> completed = auditRepo.findAll();

    return ResponseEntity.ok(Map.of(
        "pending", active.stream().filter(r -> "PENDING".equals(r.getStatus())).toList(),
        "accepted", Stream.concat(
                        active.stream().filter(r -> "ACCEPTED".equals(r.getStatus())),
                        completed.stream().filter(r -> "ACCEPTED".equals(r.getStatus()))
                    ).toList(),
        "rejected", Stream.concat(
                        active.stream().filter(r -> "REJECTED".equals(r.getStatus())),
                        completed.stream().filter(r -> "REJECTED".equals(r.getStatus()))
                    ).toList()
    ));
}
@PostMapping("/personnel/add")
public ResponseEntity<?> addPersonnel(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    if (username == null || username.isBlank()) {
        return ResponseEntity.badRequest().body("Username is required");
    }
    
    String email = username.trim().toLowerCase() + "@ewaste.com";
    
    
    if (personnelRepo.findByEmail(email) != null) {
        return ResponseEntity.badRequest().body("Personnel already exists");
    }

    Personnel p = new Personnel();
    p.setName(username.trim());
    p.setEmail(email);
    personnelRepo.save(p);

    return ResponseEntity.ok(p);
}
@DeleteMapping("/personnel/{id}")
public ResponseEntity<?> deletePersonnel(@PathVariable Long id) {
    if (!personnelRepo.existsById(id)) {
        return ResponseEntity.badRequest().body("Personnel not found");
    }
    personnelRepo.deleteById(id);
    return ResponseEntity.ok("Personnel deleted");
}


}
