package smart_e_waste.smartEwaste.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;


@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender,
                        SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    private void sendTemplateEmail(
            String to,
            String subject,
            String title,
            String templateName,
            Context context
    ) {
        context.setVariable("title", title);

        String content = templateEngine.process("email/" + templateName, context);

        Context baseContext = new Context();
        baseContext.setVariable("title", title);
        baseContext.setVariable("content", content);

        String html = templateEngine.process("email/base", baseContext);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Email sending failed", e);
        }
    }

    public void sendOtpEmail(String to, String otp) {
        Context ctx = new Context();
        ctx.setVariable("otp", otp);

        sendTemplateEmail(
                to,
                "Smart E-Waste Email Verification",
                "Verify your email",
                "otp",
                ctx
        );
    }

    public void sendAcceptanceEmail(
        String to,
        String item,
        String date,
        String time,
        String personnelName,
        String personnelEmail
) {
    Context ctx = new Context();
    ctx.setVariable("item", item);
    ctx.setVariable("date", date);
    ctx.setVariable("time", time);
    ctx.setVariable("personnelName", personnelName);
    ctx.setVariable("personnelEmail", personnelEmail);

    sendTemplateEmail(
            to,
            "Pickup Accepted",
            "Pickup Accepted",
            "acceptance",
            ctx
    );
}


    public void sendRejectionEmail(String to, String item, String reason) {
        Context ctx = new Context();
        ctx.setVariable("item", item);
        ctx.setVariable("reason", reason);

        sendTemplateEmail(
                to,
                "Pickup Rejected",
                "Pickup Rejected",
                "rejection",
                ctx
        );
    }
}
