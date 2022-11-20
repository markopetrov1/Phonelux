package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.ScrapperInfo;
import finki.it.phoneluxbackend.services.ScrapperInfoService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/scrapperinfo")
public class ScrapperInfoController{
    private final ScrapperInfoService scrapperInfoService;

    @GetMapping
    public List<ScrapperInfo> getAllScrapperInfos(){
        return scrapperInfoService.getAllScrapperInfos();
    }

}
