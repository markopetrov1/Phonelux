package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.repositories.PhoneOfferRepository;
import finki.it.phoneluxbackend.repositories.PhoneRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

        return phoneRepository.findById(phoneId).get().getPhoneOffers();
    }
}
