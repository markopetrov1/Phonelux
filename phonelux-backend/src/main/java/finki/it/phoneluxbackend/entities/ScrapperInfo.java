package finki.it.phoneluxbackend.entities;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity(name = "ScrapperInfo")
@Table(name = "scrapper_info")
public class ScrapperInfo {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(name = "store")
    private String store;
    @Column(name = "status")
    private String status;
    @Column(name = "recieved_at")
    private LocalDateTime recievedAt;

    public ScrapperInfo(String store, String status, LocalDateTime recievedAt) {
        this.store = store;
        this.status = status;
        this.recievedAt = recievedAt;
    }

}
