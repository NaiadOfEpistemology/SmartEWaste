package smart_e_waste.smartEwaste.util;

public class PasswordValidator {

    private static final String PASSWORD_REGEX ="^(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$";
    public static boolean isValid(String password) {
        if (password == null) return false;
        return password.matches(PASSWORD_REGEX);
    }
}
