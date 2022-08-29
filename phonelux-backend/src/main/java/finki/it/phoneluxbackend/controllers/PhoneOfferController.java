package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.services.PhoneOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/phone/{phoneId}")
public class PhoneOfferController {
    private final PhoneOfferService phoneOfferService;

    @Autowired
    public PhoneOfferController(PhoneOfferService phoneOfferService) {
        this.phoneOfferService = phoneOfferService;
    }

    @GetMapping
    public List<PhoneOffer> getOffersForPhone(@PathVariable("phoneId") Long phoneId){
        return phoneOfferService.getPhoneOffersForPhone(phoneId);
    }
}
