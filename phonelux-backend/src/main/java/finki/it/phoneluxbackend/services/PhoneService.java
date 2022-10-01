package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.repositories.PhoneRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
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
    public List<Phone> getPhones(String shops, String brands, String sortBy, String priceRange, String searchValue,
                                 String ram, String rom, String frontcamera, String backcamera, String chipset,
                                 String cpu, String operatingsystem, String color, String battery){
        List<Phone> phones = phoneRepository.findAll().stream()
                .filter(phone -> phone.getTotal_offers() > 0)
                .collect(Collectors.toList());


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


        // specifications filters

        if(ram != null){
            String [] memories = ram.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(memories).anyMatch(memory -> phone.getPhoneOffers().stream()
                                    .filter(offer -> offer.getRam_memory() != null)
                                    .anyMatch(offer -> hasSpecification(offer.getRam_memory(),memory))
                            )
                    )
                    .collect(Collectors.toList());
        }

        if(rom != null){
            String [] memories = rom.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(memories).anyMatch(memory -> phone.getPhoneOffers().stream()
                            .filter(offer -> offer.getRom_memory() != null)
                            .anyMatch(offer ->  hasSpecification(offer.getRom_memory(),memory))))
                    .collect(Collectors.toList());
        }

        if(frontcamera != null){
            String [] cameras = frontcamera.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(cameras).anyMatch(camera -> phone.getPhoneOffers().stream()
                            .filter(offer -> offer.getFront_camera() != null)
                            .anyMatch(offer -> hasSpecification(offer.getFront_camera(),camera)
                            )
                    )
                    )
                    .collect(Collectors.toList());
        }

        if(backcamera != null){
            String [] cameras = backcamera.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(cameras).anyMatch(camera -> phone.getPhoneOffers().stream()
                            .filter(offer -> offer.getBack_camera() != null)
                            .anyMatch(offer -> hasSpecification(offer.getBack_camera(),camera))))
                    .collect(Collectors.toList());
        }

        if(chipset != null)
        {
            String [] chipsets = chipset.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(chipsets).anyMatch(chip -> phone.getPhoneOffers().stream()
                            .filter(offer -> offer.getChipset() != null)
                            .anyMatch(offer -> offer.getChipset().contains(chip))))
                    .collect(Collectors.toList());
        }

        if(cpu != null)
        {
            String [] cpus = cpu.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(cpus).anyMatch(processor -> phone.getPhoneOffers().stream()
                            .filter(offer -> offer.getCpu() != null)
                            .anyMatch(offer -> offer.getCpu().contains(processor))))
                    .collect(Collectors.toList());
        }

        if(operatingsystem != null)
        {
            String [] operatingSystems = operatingsystem.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(operatingSystems).anyMatch(os -> phone.getPhoneOffers().stream()
                            .filter(offer -> offer.getOperating_system() != null)
                            .anyMatch(offer -> offer.getOperating_system().contains(os))))
                    .collect(Collectors.toList());
        }

        if(color != null)
        {
            String [] colors = color.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(colors).anyMatch(c -> phone.getPhoneOffers().stream()
                            .filter(offer -> offer.getColor() != null)
                            .anyMatch(offer -> offer.getColor().contains(c))))
                    .collect(Collectors.toList());
        }

        if(battery != null)
        {
            String [] batteries = battery.split(",");
            phones = phones.stream()
                    .filter(phone -> Arrays.stream(batteries).anyMatch(b -> phone.getPhoneOffers().stream()
                            .filter(offer -> offer.getBattery() != null)
                            .anyMatch(offer -> offer.getBattery().contains(b))))
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

    public boolean hasSpecification(String specification, String filter){
        if(specification.contains(filter))
        {
            if(specification.indexOf(filter)-1 < 0) {
                return true;
            }

            if(!Character.isDigit(specification
                    .charAt(specification.indexOf(filter)-1))) {
                return true;
            }
        }

        if(specification.contains(filter.split("GB")[0]+" GB"))
        {
            if(specification.indexOf(filter.split("GB")[0]+" GB")-1 < 0) {
                return true;
            }

            if(!Character.isDigit(specification
                    .charAt(specification.indexOf(filter.split("GB")[0]+" GB")-1))) {
                return true;
            }
        }

        if(specification.contains(filter.split("MP")[0]+" MP"))
        {
            if(specification.indexOf(filter.split("MP")[0]+" MP")-1 < 0) {
                return true;
            }

            if(!Character.isDigit(specification
                    .charAt(specification.indexOf(filter.split("MP")[0]+" MP")-1))) {
                return true;
            }
        }

        if(specification.contains(filter.split("MB")[0]+" MB"))
        {
            if(specification.indexOf(filter.split("MB")[0]+" MB")-1 < 0) {
                return true;
            }

            if(!Character.isDigit(specification
                    .charAt(specification.indexOf(filter.split("MB")[0]+" MB")-1))) {
                return true;
            }
        }

        return false;
    }

    public List<String> getBrands(){
        return phoneRepository.findAll().stream()
                .map(phone -> phone.getBrand().stripIndent())
                .distinct()
                .collect(Collectors.toList());
    }

    public Phone getPhoneById(Long phoneId) {
        boolean exists = phoneRepository.existsById(phoneId);
        if(!exists)
            throw new IllegalStateException("Phone with id "+phoneId+" does not exist");
        return phoneRepository.findById(phoneId).get();
    }

    public Long getTotalOffersForPhone(String phoneModel) {
        String model = String.join(" ", phoneModel.split("\\*"));
        boolean exists = phoneRepository.findPhoneByModel(model).isPresent();

        if(!exists)
            throw new IllegalStateException("Phone with model "+model+" does not exist");

        return phoneRepository.findPhoneByModel(model).get().getPhoneOffers().stream().count();
    }

    public ResponseEntity<Object> setTotalOffersForPhone(Long phoneId, int totaloffers) {
        boolean exists = phoneRepository.findById(phoneId).isPresent();

        if(!exists)
            throw new IllegalStateException("Phone with id "+phoneId+" does not exist");

        Phone phone = phoneRepository.findById(phoneId).get();
        phone.setTotal_offers(totaloffers);
        phoneRepository.save(phone);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object> setLowestPriceForPhone(Long phoneId, int lowestPrice) {
        boolean exists = phoneRepository.findById(phoneId).isPresent();

        if(!exists)
            throw new IllegalStateException("Phone with id "+phoneId+" does not exist");

        Phone phone = phoneRepository.findById(phoneId).get();
        phone.setLowestPrice(lowestPrice);
        phoneRepository.save(phone);
        return ResponseEntity.ok().build();
    }


    public ResponseEntity<Object> setImageUrlForPhone(Long phoneId, String newImageUrl) {
        boolean exists = phoneRepository.findById(phoneId).isPresent();

        if(!exists)
            throw new IllegalStateException("Phone with id "+phoneId+" does not exist");

        Phone phone = phoneRepository.findById(phoneId).get();
        phone.setImage_url(newImageUrl);
        phoneRepository.save(phone);

        return ResponseEntity.ok().build();
    }
}
