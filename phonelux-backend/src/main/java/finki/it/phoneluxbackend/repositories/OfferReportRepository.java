package finki.it.phoneluxbackend.repositories;

import finki.it.phoneluxbackend.entities.OfferReport;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfferReportRepository extends JpaRepository<OfferReport,Long> {
    Optional<OfferReport> findOfferReportByPhoneOffer(PhoneOffer phoneOffer);
}
