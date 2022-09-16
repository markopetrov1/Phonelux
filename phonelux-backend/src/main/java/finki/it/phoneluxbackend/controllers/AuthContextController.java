package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.User;
import finki.it.phoneluxbackend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class AuthContextController {
    private final UserService userService;

    // return name, role, email
    @GetMapping(path = "/token/{token}")
    public User getUserFromToken(@PathVariable("token") String token){
        return userService.getUserFromToken(token);
    }
}
