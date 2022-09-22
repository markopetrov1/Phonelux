package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.services.PhoneOfferService;
import finki.it.phoneluxbackend.services.PhoneService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/")
public class PhoneController {
    private final PhoneService phoneService;

    @GetMapping(path = "/phones")
    public List<Phone> getPhones(@RequestParam(name = "shops", required = false) String shops,
                                 @RequestParam(name = "brands", required = false) String brands,
                                 @RequestParam(name = "sortBy", required = false) String sortBy,
                                 @RequestParam(name = "priceRange", required = false) String priceRange,
                                 @RequestParam(name = "searchValue", required = false) String searchValue,
                                 @RequestParam(name = "ram", required = false) String ram,
                                 @RequestParam(name = "rom", required = false) String rom,
                                 @RequestParam(name = "frontcamera", required = false) String frontcamera,
                                 @RequestParam(name = "backcamera", required = false) String backcamera,
                                 @RequestParam(name = "chipset", required = false) String chipset,
                                 @RequestParam(name = "cpu", required = false) String cpu,
                                 @RequestParam(name = "operatingsystem", required = false) String operatingsystem,
                                 @RequestParam(name = "color", required = false) String color,
                                 @RequestParam(name = "battery", required = false) String battery){

        return phoneService.getPhones(shops,brands,sortBy,priceRange,searchValue,
                ram, rom, frontcamera, backcamera, chipset, cpu, operatingsystem, color, battery);
    }

    @GetMapping(path = "/phones/{phoneId}")
    public Phone getPhoneById(@PathVariable("phoneId") Long phoneId)
    {
        return phoneService.getPhoneById(phoneId);
    }

    @GetMapping(path = "/brands")
    public List<String> getBrands(){
        return phoneService.getBrands();
    }

}
