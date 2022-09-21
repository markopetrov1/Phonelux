package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.services.PhoneOfferService;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/admin")
@AllArgsConstructor
public class AdminController {
    private PhoneOfferService phoneOfferService;


    @PutMapping(path = "/editoffer/{offerId}", consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_XML_VALUE
    }, produces = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_XML_VALUE
    })
    public ResponseEntity<Object> editOffer(@PathVariable("offerId") Long offerId, @RequestBody PhoneOffer editedOffer){

        return phoneOfferService.editOffer(offerId,editedOffer);
    }

    @PutMapping(path = "/validateoffer/{offerId}")
    public ResponseEntity<Object> validateOffer(@PathVariable("offerId") Long offerId){
        return phoneOfferService.validateOffer(offerId);
    }


    @GetMapping(path = "/editoffer/{offerId}")
    public ResponseEntity<Object> getOffer(@PathVariable("offerId") Long offerId){
        return ResponseEntity.ok().body(phoneOfferService.getPhoneOffer(offerId));
    }
}
