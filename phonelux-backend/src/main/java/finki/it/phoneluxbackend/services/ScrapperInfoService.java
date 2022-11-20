package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.ScrapperInfo;
import finki.it.phoneluxbackend.repositories.ScrapperInfoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ScrapperInfoService {
    private final ScrapperInfoRepository scrapperInfoRepository;

    public List<ScrapperInfo> getAllScrapperInfos() {
        return scrapperInfoRepository.findAll();
    }
}
