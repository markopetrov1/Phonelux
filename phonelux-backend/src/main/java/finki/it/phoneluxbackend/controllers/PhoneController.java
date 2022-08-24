package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.services.PhoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/")
public class PhoneController {
    private final PhoneService phoneService;

    @Autowired
    public PhoneController(PhoneService phoneService) {
        this.phoneService = phoneService;
    }

    @GetMapping
    public List<Phone> getPhones(){
        return phoneService.getPhones();
    }

    @PostMapping(path = "{phoneId}")
    public List<PhoneOffer> getOffersForPhone(@PathVariable("phoneId") Long phoneId){
        return phoneService.getOffersForPhone(phoneId);
    }

}
