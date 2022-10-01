package finki.it.phoneluxbackend.repositories;

import finki.it.phoneluxbackend.entities.Phone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhoneRepository extends JpaRepository<Phone,Long> {
    Optional<Phone> findPhoneByModel(String model);
}
