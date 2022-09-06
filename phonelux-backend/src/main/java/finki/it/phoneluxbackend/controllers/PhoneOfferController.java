package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.services.PhoneOfferService;
import finki.it.phoneluxbackend.services.PhoneService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/phones/offers/{phoneId}")
public class PhoneOfferController {
    private final PhoneOfferService phoneOfferService;
    private final PhoneService phoneService;

    @GetMapping
    public List<PhoneOffer> getOffersForPhone(@PathVariable("phoneId") Long phoneId){
        return phoneOfferService.getPhoneOffersForPhone(phoneId);
    }

}
