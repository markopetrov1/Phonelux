package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.entities.User;
import finki.it.phoneluxbackend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/management")
@AllArgsConstructor
public class SuperAdminController {
    private final UserService userService;

    @GetMapping(path = "/users")
    public List<User> getUsers(@RequestParam(name = "searchValue", required = false) String searchValue){
        return userService.getUsers(searchValue);
    }

    @PutMapping(path = "/addadmin/{userId}")
    public ResponseEntity<Object> giveAdminRoleToUser(@PathVariable("userId") Long userId){
        return userService.giveAdminRoleToUser(userId);
    }

    @PutMapping(path = "/removeadmin/{userId}")
    public ResponseEntity<Object> removeAdminRoleFromUser(@PathVariable("userId") Long userId){
        return userService.removeAdminRoleFromUser(userId);
    }

}
