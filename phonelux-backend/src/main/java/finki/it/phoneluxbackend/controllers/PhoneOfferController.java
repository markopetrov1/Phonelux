package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.services.PhoneOfferService;
import finki.it.phoneluxbackend.services.PhoneService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class PhoneOfferController {
    private final PhoneOfferService phoneOfferService;


    @GetMapping(path = "/alloffers")
    public List<PhoneOffer> getAllOffers(){
        return phoneOfferService.getAllOffers();
    }
    @GetMapping(path = "/phones/offers/{phoneId}")
    public List<PhoneOffer> getOffersForPhone(@PathVariable("phoneId") Long phoneId){
        return phoneOfferService.getPhoneOffersForPhone(phoneId);
    }

    @GetMapping(path = "/multipleoffers")
    public List<PhoneOffer> getMultiplePhoneOffers(@RequestParam("offerIds") String offerIds){
        return phoneOfferService.getMultiplePhoneOffers(offerIds);
    }

    @GetMapping(path = "/phoneoffer/shop/{shop}")
    public List<PhoneOffer> getOffersFromShop(@PathVariable("shop") String shop){
        return phoneOfferService.getOffersFromShop(shop);
    }

    @GetMapping(path = "/phoneoffer/{offerId}")
    public PhoneOffer getPhoneOffer(@PathVariable("offerId") Long offerId){
        return phoneOfferService.getPhoneOffer(offerId);
    }

    @GetMapping(path = "/phoneoffer/{offerId}/cheaperoffers")
    public List<PhoneOffer> getCheaperOffers(@PathVariable("offerId") Long offerId){
        return phoneOfferService.getCheaperOffers(offerId);
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


    @PutMapping(path = "/phoneoffer/{offerId}/addphonemodel/{phoneId}")
    public ResponseEntity<Object> addPhoneModelToOffer(@PathVariable("offerId") Long offerId,
                                                       @PathVariable("phoneId") Long phoneId)
    {
        return phoneOfferService.addPhoneModelToOffer(offerId,phoneId);
    }
    @PutMapping(path = "/phoneoffer/{offerId}/changeprice/{price}")
    public ResponseEntity<Object> changePriceForOffer(@PathVariable("offerId") Long offerId,
                                                       @PathVariable("price") int price)
    {
        return phoneOfferService.changePriceForOffer(offerId,price);
    }

    @PostMapping(path = "/phoneoffer/addoffer")
    public ResponseEntity<Object> addOffer(@RequestBody PhoneOffer offer)
    {
        return phoneOfferService.addOffer(offer);
    }

    @DeleteMapping(path = "/phoneoffer/deleteoffer/{offerId}")
    public ResponseEntity<Object> deleteOffer(@PathVariable("offerId") Long offerId)
    {
        return phoneOfferService.deleteOffer(offerId);
    }
}
