package finki.it.phoneluxbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity(name = "PhoneOffer")
@Table(name = "phone_offers")
public class PhoneOffer {
    @Id
    @Column(name = "offer_id")
    private Long id;

    @Column(name = "offer_shop")
    private String offer_shop;

    @Column(name = "offer_name")
    private String offer_name;

    @Column(name = "price")
    private Integer price;

    @Column(name = "ram_memory")
    private String ram_memory;

    @Column(name = "rom_memory")
    private String rom_memory;

    @Column(name = "color")
    private String color;

    @Column(name = "front_camera")
    private String front_camera;

    @Column(name = "back_camera")
    private String back_camera;

    @Column(name = "chipset")
    private String chipset;

    @Column(name = "battery")
    private String battery;

    @Column(name = "operating_system")
    private String operating_system;

    @Column(name = "cpu")
    private String cpu;

    @Column(name = "image_url")
    private String image_url;

    @Column(name = "offer_url")
    private String offer_url;

    @Column(name = "last_updated")
    private Date last_updated;

    @Column(name = "is_validated")
    private Boolean is_validated;

    @Column(name = "offer_description")
    private String offer_description;

    @Column(name = "offer_shop_code")
    private String offer_shop_code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phone_id", referencedColumnName = "id")
    @JsonIgnore
    private Phone phone;
}
