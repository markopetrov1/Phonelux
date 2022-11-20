package finki.it.phoneluxbackend.services;

import finki.it.phoneluxbackend.entities.OfferReport;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import finki.it.phoneluxbackend.entities.User;
import finki.it.phoneluxbackend.repositories.OfferReportRepository;
import finki.it.phoneluxbackend.repositories.PhoneOfferRepository;
import finki.it.phoneluxbackend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class OfferReportService {
    private final OfferReportRepository offerReportRepository;
    private final PhoneOfferRepository phoneOfferRepository;
    private final UserRepository userRepository;

    public ResponseEntity<Object> reportOffer(Long offerId, Long userId) {
        boolean exists = phoneOfferRepository.findById(offerId).isPresent();

        if(!exists){
            return ResponseEntity.badRequest().body("Понудата не постои");
        }

        exists = userRepository.findById(userId).isPresent();

        if(!exists){
            return ResponseEntity.badRequest().body("Корисникот не постои");
        }

        User user = userRepository.findById(userId).get();
        PhoneOffer offer = phoneOfferRepository.findById(offerId).get();

        exists = offerReportRepository.findOfferReportByPhoneOffer(offer).isPresent();
        OfferReport offerReport;
        if(exists)
        {
            offerReport = offerReportRepository.findOfferReportByPhoneOffer(offer).get();
            offerReport.setTimes_reported(offerReport.getTimes_reported()+1);
            offerReport.setReportedAt(LocalDateTime.now());
            offerReport.setReportedBy(user.getEmail());
        }
        else{
            offerReport = new OfferReport(offer, 1, LocalDateTime.now(), user.getEmail());
        }

        offerReportRepository.save(offerReport);

        return ResponseEntity.ok().build();
    }

    public List<OfferReport> getAllOfferReports() {
        return offerReportRepository.findAll();
    }

    public ResponseEntity<Object> removeOfferReport(Long offerReportId) {
        boolean exists = offerReportRepository.findById(offerReportId).isPresent();

        if(!exists){
            return ResponseEntity.badRequest().body("Пријавата не постои");
        }

        offerReportRepository.deleteById(offerReportId);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object> removeAllOfferReports() {
        offerReportRepository.deleteAll();
        return ResponseEntity.ok().build();
    }
}
