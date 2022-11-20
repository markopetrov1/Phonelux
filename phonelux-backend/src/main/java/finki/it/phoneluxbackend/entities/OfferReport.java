package finki.it.phoneluxbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class OfferReport {
    @SequenceGenerator(
            name = "offer_report_sequence",
            sequenceName = "offer_report_sequence",
            allocationSize = 1
    )
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "offer_report_sequence"
    )
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offer_id", referencedColumnName = "offer_id")
    private PhoneOffer phoneOffer;

    private Integer times_reported;

    private LocalDateTime reportedAt;

    private String reportedBy;


    public OfferReport(PhoneOffer phoneOffer, Integer times_reported, LocalDateTime reportedAt, String reportedBy) {
        this.phoneOffer = phoneOffer;
        this.times_reported = times_reported;
        this.reportedAt = reportedAt;
        this.reportedBy = reportedBy;
    }
}
