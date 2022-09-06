package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.repositories.PhoneRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhoneService {
    private final PhoneRepository phoneRepository;

    public PhoneService(PhoneRepository phoneRepository){
        this.phoneRepository = phoneRepository;
    }


    // TODO: insert logic to filter
    public List<Phone> getPhones(){
        return phoneRepository.findAll();
    }

    public List<String> getBrands(){
        return phoneRepository.findAll().stream()
                .map(Phone::getBrand).distinct()
                .collect(Collectors.toList());
    }

    public Phone getPhoneById(Long phoneId) {
        boolean exists = phoneRepository.existsById(phoneId);
        if(!exists)
            throw new IllegalStateException("Phone with id "+phoneId+" does not exist");
        return phoneRepository.findById(phoneId).get();
    }
}
