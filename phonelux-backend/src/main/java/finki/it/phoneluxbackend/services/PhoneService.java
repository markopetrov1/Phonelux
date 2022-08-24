package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.repositories.PhoneRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhoneService {
    private final PhoneRepository phoneRepository;

    public PhoneService(PhoneRepository phoneRepository){
        this.phoneRepository = phoneRepository;
    }

    public List<Phone> getPhones(){
        return phoneRepository.findAll();
    }

    public List<PhoneOffer> getOffersForPhone(Long phoneId) {
        boolean exists = phoneRepository.existsById(phoneId);
        if(!exists)
            throw new IllegalStateException("Phone with id "+phoneId+" does not exist");

        return phoneRepository.findById(phoneId).get().getPhoneOffers();
    }
}
