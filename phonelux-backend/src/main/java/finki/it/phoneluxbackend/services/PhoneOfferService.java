package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.repositories.PhoneOfferRepository;
import finki.it.phoneluxbackend.repositories.PhoneRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhoneOfferService {
    private final PhoneOfferRepository phoneOfferRepository;
    private final PhoneRepository phoneRepository;

    public PhoneOfferService(PhoneOfferRepository phoneOfferRepository, PhoneRepository phoneRepository) {
        this.phoneOfferRepository = phoneOfferRepository;
        this.phoneRepository = phoneRepository;
    }

    public List<PhoneOffer> getPhoneOffersForPhone(Long phoneId) {
        boolean exists = phoneRepository.existsById(phoneId);
        if(!exists)
            throw new IllegalStateException("Phone with id "+phoneId+" does not exist");

        return phoneRepository.findById(phoneId).get().getPhoneOffers()
                .stream().sorted(Comparator.comparing(PhoneOffer::getPrice)).collect(Collectors.toList());
    }

    public PhoneOffer getPhoneOffer(Long offerId){
        boolean exists = phoneOfferRepository.existsById(offerId);

        if(!exists)
            throw new IllegalStateException("Phone offer with id "+offerId+" does not exist");

        return phoneOfferRepository.findById(offerId).get();
    }


    public List<String> getShops() {
        return phoneOfferRepository.findAll().stream()
                .map(PhoneOffer::getOffer_shop)
                .distinct()
                .collect(Collectors.toList());
    }


    public int getLowestPrice() {
        return phoneOfferRepository.findAll()
                .stream().sorted(Comparator.comparing(PhoneOffer::getPrice))
                .collect(Collectors.toList()).get(0).getPrice();
    }

    public int getHighestPrice() {
        return phoneOfferRepository.findAll()
                .stream().sorted(Comparator.comparing(PhoneOffer::getPrice).reversed())
                .collect(Collectors.toList()).get(0).getPrice();
    }

}
