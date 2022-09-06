package finki.it.phoneluxbackend.services;


import finki.it.phoneluxbackend.entities.User;
import finki.it.phoneluxbackend.repositories.UserRepository;
import finki.it.phoneluxbackend.entities.ConfirmationToken;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ConfirmationTokenService confirmationTokenService;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email "+email+" not found!"));
    }

    public ResponseEntity<Object> signUpUser(User user)
    {
       boolean userExists = userRepository.findByEmail(user.getEmail()).isPresent();


       if (userExists){
           User userToRegister =  userRepository.findByEmail(user.getEmail()).get();
           if(userToRegister.getEnabled()) {
               return ResponseEntity.badRequest().body("Error: Email "+user.getEmail()+" already taken!");
           }
           else {
               return ResponseEntity.badRequest().body("Email "+user.getEmail()+" not activated!" );
           }
       }

       String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());

       user.setPassword(encodedPassword);

        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15),
                user
                );

        confirmationTokenService.saveConfirmationToken(confirmationToken);

        return ResponseEntity.ok().body("token:"+token);
    }

    public int enableUser(String email) {
        return userRepository.enableUser(email);
    }


}
