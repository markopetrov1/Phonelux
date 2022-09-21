package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.services.PhoneOfferService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/specifications")
public class SpecificationsController {
    private final PhoneOfferService phoneOfferService;

    // specifications endpoints
    @GetMapping(path = "/ram")
    public List<String> getRamMemories()
    {
        return phoneOfferService.getRamMemories();
    }

    @GetMapping(path = "/rom")
    public List<String> getRomMemories()
    {
        return phoneOfferService.getRomMemories();
    }

    @GetMapping(path = "/color")
    public List<String> getColors()
    {
        return phoneOfferService.getColors();
    }

    @GetMapping(path = "/chipset")
    public List<String> getChipsets()
    {
        return phoneOfferService.getChipsets();
    }

    @GetMapping(path = "/cpu")
    public List<String> getCPUs()
    {
        return phoneOfferService.getCPUs();
    }

    @GetMapping(path = "/frontcamera")
    public List<String> getFrontCameras()
    {
        return phoneOfferService.getFrontCameras();
    }

    @GetMapping(path = "/backcamera")
    public List<String> getBackCameras()
    {
        return phoneOfferService.getBackCameras();
    }

    @GetMapping(path = "/battery")
    public List<String> getBatteries()
    {
        return phoneOfferService.getBatteries();
    }

    @GetMapping(path = "/operatingsystem")
    public List<String> getOperatingSystems()
    {
        return phoneOfferService.getOperatingSystems();
    }

}
