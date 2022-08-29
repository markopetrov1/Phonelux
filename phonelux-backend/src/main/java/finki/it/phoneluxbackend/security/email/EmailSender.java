package finki.it.phoneluxbackend.security.email;

public interface EmailSender {
    void send(String to, String email);
}
