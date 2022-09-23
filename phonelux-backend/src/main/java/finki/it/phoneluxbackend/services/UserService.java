package finki.it.phoneluxbackend.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import finki.it.phoneluxbackend.data.UserRole;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.entities.User;
import finki.it.phoneluxbackend.repositories.PhoneOfferRepository;
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

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PhoneOfferRepository phoneOfferRepository;
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
               return ResponseEntity.badRequest().body("Error:Е-маил адресата е веќе зафатена!");
           }
           else {
               return ResponseEntity.badRequest().body("Error:Профилот не е активиран. Потврдете на вашата е-маил адреса!" );
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


    public User getUserFromToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        String email = decodedJWT.getSubject();
        UserRole role = UserRole.valueOf(decodedJWT.getClaim("role").asArray(String.class)[0]);
        String name = decodedJWT.getClaim("name").as(String.class);
        Long id = decodedJWT.getClaim("id").as(Long.class);
//        String pickedSpecifications = decodedJWT.getClaim("pickedSpecifications").as(String.class);
        return new User(id,name,role);
    }

    public List<PhoneOffer> getFavouriteOffersForUser(Long userId) {
        boolean exists = userRepository.existsById(userId);
        if(!exists)
            throw new IllegalStateException("User with id "+userId+" does not exist");

        return userRepository.findById(userId).get().getFavouriteOffers();
    }

    public ResponseEntity<Object> editOfferForUser(Long userId, Long offerId, String option) {
        boolean userExists = userRepository.existsById(userId);
        if (!userExists)
        {
            return ResponseEntity.badRequest().body("User with id "+userId+" doesn't exist");
        }

        boolean offerExists = phoneOfferRepository.existsById(offerId);

        if (!offerExists)
        {
            return ResponseEntity.badRequest().body("Offer with id "+offerId+" doesn't exist");
        }

        User user = userRepository.findById(userId).get();
        PhoneOffer phoneOffer = phoneOfferRepository.findById(offerId).get();

        if(option.equals("add")) {
            user.getFavouriteOffers().add(phoneOffer);
        }
        else{
            user.getFavouriteOffers().remove(phoneOffer);
        }

        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    public List<User> getUsers(String searchValue) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getUserRole() != UserRole.SUPERADMIN && user.getEnabled())
                .map(user -> new User(user.getId(),user.getFirstName(),
                        user.getLastName(),user.getEmail(),user.getUserRole()))
                .collect(Collectors.toList());

        if(searchValue != null)
        {
            users = users.stream()
                    .filter(user -> user.getEmail().toLowerCase().contains(searchValue.stripIndent().toLowerCase())
                    || user.getFirstName().toLowerCase().contains(searchValue.stripIndent().toLowerCase()))
                    .collect(Collectors.toList());
        }

        return users.stream()
                .sorted(Comparator.comparing(User::getId))
                .collect(Collectors.toList());

    }

    public ResponseEntity<Object> giveAdminRoleToUser(Long userId) {
        boolean userExists = userRepository.existsById(userId);
        if (!userExists)
        {
            return ResponseEntity.badRequest().body("User with id "+userId+" doesn't exist");
        }

        User user = userRepository.findById(userId).get();

        user.setUserRole(UserRole.ADMIN);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object> removeAdminRoleFromUser(Long userId) {
        boolean userExists = userRepository.existsById(userId);
        if (!userExists)
        {
            return ResponseEntity.badRequest().body("User with id "+userId+" doesn't exist");
        }

        User user = userRepository.findById(userId).get();

        user.setUserRole(UserRole.USER);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object> editSpecificationsForUser(Long userId, String specifications) {
        boolean userExists = userRepository.existsById(userId);
        if (!userExists)
        {
            return ResponseEntity.badRequest().body("User with id "+userId+" doesn't exist");
        }
        User user = userRepository.findById(userId).get();

        user.setSpecifications(specifications);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    public String getSpecificationsForUser(Long userId) {
        boolean userExists = userRepository.existsById(userId);
        if (!userExists)
        {
            throw new UsernameNotFoundException("User with id "+userId+" doesn't exist");
        }

        User user = userRepository.findById(userId).get();

        return user.getSpecifications() != null ? user.getSpecifications() : "[]";
    }
}
