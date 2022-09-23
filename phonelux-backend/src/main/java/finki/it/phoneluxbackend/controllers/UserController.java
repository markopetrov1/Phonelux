package finki.it.phoneluxbackend.controllers;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.entities.User;
import finki.it.phoneluxbackend.services.PhoneOfferService;
import finki.it.phoneluxbackend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/user")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping(path = "/{userId}/favouriteoffers")
    public List<PhoneOffer> getFavouriteOffersForUser(@PathVariable("userId") Long userId){
        return userService.getFavouriteOffersForUser(userId);
    }

    @PutMapping(path = "/{userId}/addoffer/{offerId}")
    public ResponseEntity<Object> addOfferForUser(@PathVariable("userId") Long userId,
                                              @PathVariable("offerId") Long offerId){
        return userService.editOfferForUser(userId,offerId, "add");
    }

    @PutMapping(path = "/{userId}/removeoffer/{offerId}")
    public ResponseEntity<Object> removeOfferForUser(@PathVariable("userId") Long userId,
                                                  @PathVariable("offerId") Long offerId){
        return userService.editOfferForUser(userId,offerId, "remove");
    }

    @PutMapping(path = "/{userId}/editspecifications")
    public ResponseEntity<Object> editSpecificationsForUser(@PathVariable("userId") Long userId,
                                                            @RequestBody String specifications){
        return userService.editSpecificationsForUser(userId,specifications);
    }

    @GetMapping(path = "/{userId}/getspecifications")
    public String getSpecificationsForUser(@PathVariable("userId") Long userId){
        return userService.getSpecificationsForUser(userId);
    }

}
