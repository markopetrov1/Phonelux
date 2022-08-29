package finki.it.phoneluxbackend.repositories;
import finki.it.phoneluxbackend.entities.PhoneOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhoneOfferRepository extends JpaRepository<PhoneOffer,Long> {

}
