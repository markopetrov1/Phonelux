package finki.it.phoneluxbackend.repositories;

import finki.it.phoneluxbackend.entities.ScrapperInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScrapperInfoRepository extends JpaRepository<ScrapperInfo, Long> {
}
