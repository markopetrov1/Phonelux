package finki.it.phoneluxbackend.repositories;

import finki.it.phoneluxbackend.entities.Phone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhoneRepository extends JpaRepository<Phone,Long> {

}
