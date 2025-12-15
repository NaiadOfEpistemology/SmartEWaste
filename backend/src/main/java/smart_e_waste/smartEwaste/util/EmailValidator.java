package smart_e_waste.smartEwaste.util;

public class EmailValidator {

    private static final String EMAIL_REGEX ="^[A-Za-z0-9._%+-]{2,}@(gmail\\.com|yahoo\\.com)$";
    public static boolean isValid(String email){
        if(email == null) return false;
        return email.trim().toLowerCase().matches(EMAIL_REGEX);
    }
}
