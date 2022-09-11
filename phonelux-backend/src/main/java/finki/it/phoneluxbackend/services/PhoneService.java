package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.repositories.PhoneRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PhoneService {
    private final PhoneRepository phoneRepository;

    public PhoneService(PhoneRepository phoneRepository){
        this.phoneRepository = phoneRepository;
    }


    // TODO: insert logic to filter
    public List<Phone> getPhones(String shops, String brands, String sortBy, String priceRange, String searchValue){
        List<Phone> phones = phoneRepository.findAll();


        if(brands != null)
        {
            phones = phones.stream()
                    .filter(phone -> brands.contains(phone.getBrand())).collect(Collectors.toList());
        }

        if(shops != null)
        {
            phones = phones.stream()
                    .filter(phone -> phone.getPhoneOffers().stream().anyMatch(offer -> shops.contains(offer.getOffer_shop())))
                    .collect(Collectors.toList());
        }

        if(priceRange != null)
        {
            int lowestPrice = Integer.parseInt(priceRange.split("-")[0]);
            int highestPrice = Integer.parseInt(priceRange.split("-")[1]);
            phones = phones.stream()
                    .filter(phone -> phone.getLowestPrice() >= lowestPrice && phone.getLowestPrice() <= highestPrice)
                    .collect(Collectors.toList());
        }

        if(searchValue != null && !Objects.equals(searchValue.stripIndent(), "")){
            phones = phones.stream()
                    .filter(phone -> phone.getBrand().toLowerCase().contains(searchValue.stripIndent().toLowerCase())
                            || phone.getModel().toLowerCase().contains(searchValue.stripIndent().toLowerCase()))
                    .collect(Collectors.toList());
        }

        phones = phones.stream().sorted(Comparator.comparing(Phone::getTotal_offers).reversed())
                .collect(Collectors.toList());
        if(sortBy != null)
        {
            if(sortBy.equals("ascending")) {
                phones = phones.stream()
                        .sorted(Comparator.comparing(Phone::getLowestPrice))
                        .collect(Collectors.toList());
            }

            if(sortBy.equals("descending")) {
                phones = phones.stream()
                        .sorted(Comparator.comparing(Phone::getLowestPrice).reversed())
                        .collect(Collectors.toList());
            }
        }

        return phones;
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
