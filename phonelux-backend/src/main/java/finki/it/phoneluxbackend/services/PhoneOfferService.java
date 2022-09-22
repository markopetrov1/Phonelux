package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.Phone;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.repositories.PhoneOfferRepository;
import finki.it.phoneluxbackend.repositories.PhoneRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
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

    public List<PhoneOffer> getCheaperOffers(Long offerId) {
        boolean exists = phoneOfferRepository.existsById(offerId);

        if(!exists)
            throw new IllegalStateException("Phone offer with id "+offerId+" does not exist");

        PhoneOffer offer = phoneOfferRepository.findById(offerId).get();

        return phoneOfferRepository.findAll()
                .stream().filter(phoneOffer ->
                        Objects.equals(phoneOffer.getPhone().getModel(), offer.getPhone().getModel())
                                && phoneOffer.getPrice() < offer.getPrice())
                .sorted(Comparator.comparing(PhoneOffer::getPrice).reversed())
                .collect(Collectors.toList());
    }

    public ResponseEntity<Object> editOffer(Long offerId, PhoneOffer editedOffer) {
        boolean exists = phoneOfferRepository.existsById(offerId);

        if(!exists)
            throw new IllegalStateException("Phone offer with id "+offerId+" does not exist");

        PhoneOffer oldOffer = phoneOfferRepository.findById(offerId).get();

        editedOffer.setPhone(oldOffer.getPhone());
        editedOffer.setUsers(oldOffer.getUsers());
        editedOffer.setIs_validated(false);
        editedOffer.setLast_updated(new Date());

        phoneOfferRepository.save(editedOffer);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object> validateOffer(Long offerId) {
        boolean exists = phoneOfferRepository.existsById(offerId);

        if(!exists)
            throw new IllegalStateException("Phone offer with id "+offerId+" does not exist");

        PhoneOffer offer = phoneOfferRepository.findById(offerId).get();

        offer.setIs_validated(true);
        offer.setLast_updated(new Date());
        phoneOfferRepository.save(offer);

        return ResponseEntity.ok().build();
    }

    public List<PhoneOffer> getMultiplePhoneOffers(String offerIds) {
        List<Long> idList = Arrays.stream(offerIds.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());

        List<PhoneOffer> phoneOffers = new ArrayList<>();

        idList.stream().forEach(id -> {
            phoneOffers.add(phoneOfferRepository.findById(id).get());
        });

        return phoneOffers;
    }

    public List<PhoneOffer> getOffersFromShop(String shop) {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();

        return offers.stream()
                .filter(offer -> offer.getOffer_shop().equalsIgnoreCase(shop))
                .collect(Collectors.toList());
    }

    public List<String> getRamMemories() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();

        List<String> temp = new ArrayList<>();

        offers.stream()
                .map(PhoneOffer::getRam_memory)
                .filter(ram -> ram != null && (ram.toLowerCase().contains("gb") || ram.toLowerCase().contains("mb")))
                .forEach(ram -> {
                    temp.addAll(Arrays.asList(ram.replaceAll("\\s+", "")
                                    .replaceAll("Ram", "")
                            .split("[,/]")));
                });

        return getMemories(temp);
    }

    public List<String> getRomMemories() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();

        List<String> temp = new ArrayList<>();

        offers.stream()
                .map(PhoneOffer::getRom_memory)
                .filter(rom -> rom != null && (rom.toLowerCase().contains("gb") || rom.toLowerCase().contains("mb")))
                .forEach(ram -> {
                    temp.addAll(Arrays.asList(ram.replaceAll("\\s+", "")
                            .replaceAll("Rom", "")
                            .replaceAll("storage", "")
                            .split("[,/]")));
                });

        return getMemories(temp);
    }

    private List<String> getMemories(List<String> temp) {
        List<String> memories = new ArrayList<>();

        temp.stream()
                .filter(memory -> memory.toLowerCase().contains("mb"))
                .sorted()
                .forEach(memories::add);

        temp.stream()
                .filter(memory -> memory.toLowerCase().contains("gb"))
                .sorted()
                .forEach(memories::add);


        return memories.stream()
                .filter(memory -> memory.matches("\\S*\\d+\\S*"))
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getColors() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();
        List<String> colors = new ArrayList<>();

        return offers.stream()
                .map(PhoneOffer::getColor)
                .filter(colorRow -> colorRow != null && !colorRow.equals("") && !colorRow.equals("/"))
                .flatMap(color -> Arrays.stream(color.split(",")))
                .map(String::stripIndent)
                .filter(color -> !color.matches("\\S+\\d+\\S+") && !color.equals(""))
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getChipsets() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();
        List<String> temp = new ArrayList<>();
        List<String> chipsets = new ArrayList<>();

        temp = offers.stream()
                .map(PhoneOffer::getChipset)
                .filter(chipset -> chipset != null && !chipset.equals("") && !chipset.equals("/"))
                .distinct()
                .collect(Collectors.toList());

        temp.stream()
                .forEach(chipset -> chipsets.add(chipset.replaceAll("5G ", "")));

        return chipsets.stream()
                .filter(chipset -> !chipset.contains("\r"))
                .map(offer -> offer.split("\\(")[0].stripIndent())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getCPUs() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();

        return offers.stream()
                .map(PhoneOffer::getCpu)
                .filter(cpu -> cpu!=null && !cpu.equals("") && !cpu.equals("/"))
                .map(cpu -> cpu.split("\n")[0].stripIndent().replaceAll("\n",""))
                .filter(cpu -> !cpu.contains("Snapdragon") && !cpu.contains("Exynos"))
                .filter(cpu -> Character.isAlphabetic(cpu.charAt(0)))
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getFrontCameras() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();

        return offers.stream()
                .map(PhoneOffer::getFront_camera)
                .filter(camera -> camera != null && !camera.equals("") && !camera.equals("/"))
                .map(camera -> camera.split("MP")[0].stripIndent()+"MP")
                .filter(camera -> !camera.contains("\n"))
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getBackCameras() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();

        List<String> cameras = offers.stream()
                .map(PhoneOffer::getBack_camera)
                .filter(camera -> camera != null && !camera.equals("") && !camera.equals("/"))
                .map(camera -> camera.split("[\n,]")[0].replaceAll("\t",""))
                .flatMap(camera -> Arrays.stream(camera.split("[+/]")))
                .map(camera -> camera.replaceAll("MP","").stripIndent())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        cameras.stream()
                .forEach(camera -> {
                    if(Character.isDigit(camera.charAt(0)))
                    cameras.set(cameras.indexOf(camera), camera+"MP");

                });

        return cameras;
    }

    public List<String> getBatteries() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();

        return offers.stream()
                .map(PhoneOffer::getBattery)
                .filter(battery -> battery != null && !battery.equals("") && !battery.equals("/"))
                .map(battery -> battery.split(",")[0]
                        .split("\n")[0]
                        .replaceAll("'","")
                        .replaceAll("\t"," ")
                        .stripIndent())
                .map(battery -> battery.replaceAll("battery", "").stripIndent())
                .distinct()
                .sorted(Comparator.reverseOrder())
                .collect(Collectors.toList());
    }

    public List<String> getOperatingSystems() {
        List<PhoneOffer> offers = phoneOfferRepository.findAll();

        return offers.stream()
                .map(PhoneOffer::getOperating_system)
                .filter(os -> os != null && !os.equals("") && !os.equals("/"))
                .map(os -> os.split("[,(-]")[0].stripIndent())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}
