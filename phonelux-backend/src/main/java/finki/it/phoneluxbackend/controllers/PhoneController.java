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
    private final PhoneOfferService phoneOfferService;

//     handle request parameters for filtering phones
    @GetMapping(path = "/phones")
    public List<Phone> getPhones(@RequestParam(name = "shops", required = false) String shops,
                                 @RequestParam(name = "brands", required = false) String brands,
                                 @RequestParam(name = "sortBy", required = false) String sortBy,
                                 @RequestParam(name = "priceRange", required = false) String priceRange,
                                 @RequestParam(name = "searchValue", required = false) String searchValue){

        return phoneService.getPhones(shops,brands,sortBy,priceRange,searchValue);
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

    @GetMapping(path = "/shops")
    public List<String> getShops(){
        return phoneOfferService.getShops();
    }

    @GetMapping(path = "/lowestPrice")
    public int getLowestPrice()
    {
        return phoneOfferService.getLowestPrice();
    }

    @GetMapping(path = "/highestPrice")
    public int getHighestPrice()
    {
        return phoneOfferService.getHighestPrice();
    }


}
