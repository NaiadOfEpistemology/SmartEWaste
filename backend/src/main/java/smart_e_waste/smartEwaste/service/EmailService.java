package smart_e_waste.smartEwaste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp){
        SimpleMailMessage msg=new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("SmartEWaste Email Verification");
        msg.setText("Your OTP is : " + otp);
        mailSender.send(msg);
    }
    public void sendAcceptanceEmail(String to, String itemName, String pickupDate, String pickupTime) {
        SimpleMailMessage msg=new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("E-Waste Pickup Accepted");
    
        String body =
            "Hi,\n\n" +
            "Your e-waste pickup request for \"" + itemName + "\" is accepted.\n\n" +
            "Pickup Details:\n" +
            "Date: " + pickupDate + "\n" +
            "Time: " + pickupTime + "\n\n" +
            "Please be available at your specified location.\n\n" +
            "Thank you.";
    
        msg.setText(body);
        mailSender.send(msg);
    }
    
    public void sendRejectionEmail(String to, String itemName, String reason) {
        SimpleMailMessage msg=new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("E-Waste Pickup Request Rejected");
    
        String body =
            "Hi,\n\n" +
            "Your e-waste pickup request for \"" + itemName + "\" is rejected.\n\n" +
            "Reason :\n" + reason + "\n\n" +
            "Thank you.";
    
        msg.setText(body);
        mailSender.send(msg);
    }
}
