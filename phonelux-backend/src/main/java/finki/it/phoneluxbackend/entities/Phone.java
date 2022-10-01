package finki.it.phoneluxbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity(name = "Phone")
@Table(name = "phones")
public class Phone {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "brand")
    private String brand;

    @Column(name = "model")
    private String model;

    @Column(name = "image_url")
    private String image_url;

    @Column(name = "total_offers")
    private Integer total_offers;

    @Column(name = "lowest_price")
    private Integer lowestPrice;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "phone")
    @JsonIgnore
    private List<PhoneOffer> phoneOffers;

    public Phone(String brand, String model) {
        this.brand = brand;
        this.model = model;
    }

    public Phone(Long id, String brand, String model, String image_url, Integer total_offers, Integer lowestPrice) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.image_url = image_url;
        this.total_offers = total_offers;
        this.lowestPrice = lowestPrice;
    }
}
