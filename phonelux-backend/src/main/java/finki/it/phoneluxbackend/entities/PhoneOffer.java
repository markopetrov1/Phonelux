package finki.it.phoneluxbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
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

    @ManyToMany(mappedBy = "favouriteOffers")
    @JsonIgnore
    private List<User> users = new ArrayList<User>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phone_id", referencedColumnName = "id")
    @JsonIgnore
    private Phone phone;

    public PhoneOffer(String offer_shop, String offer_name,
                      Integer price, String ram_memory,
                      String rom_memory, String color,
                      String front_camera, String back_camera,
                      String chipset, String battery,
                      String operating_system, String cpu,
                      String image_url, String offer_url,
                      Date last_updated, Boolean is_validated,
                      String offer_description, String offer_shop_code, Phone phone) {
        this.offer_shop = offer_shop;
        this.offer_name = offer_name;
        this.price = price;
        this.ram_memory = ram_memory;
        this.rom_memory = rom_memory;
        this.color = color;
        this.front_camera = front_camera;
        this.back_camera = back_camera;
        this.chipset = chipset;
        this.battery = battery;
        this.operating_system = operating_system;
        this.cpu = cpu;
        this.image_url = image_url;
        this.offer_url = offer_url;
        this.last_updated = last_updated;
        this.is_validated = is_validated;
        this.offer_description = offer_description;
        this.offer_shop_code = offer_shop_code;
        this.phone = phone;
    }

    public PhoneOffer(Long id,
                      String offer_shop,
                      String offer_name,
                      Integer price,
                      String ram_memory,
                      String rom_memory,
                      String color,
                      String front_camera,
                      String back_camera,
                      String chipset,
                      String battery,
                      String operating_system,
                      String cpu,
                      String image_url,
                      String offer_url,
                      Date last_updated,
                      Boolean is_validated,
                      String offer_description,
                      String offer_shop_code) {
        this.id = id;
        this.offer_shop = offer_shop;
        this.offer_name = offer_name;
        this.price = price;
        this.ram_memory = ram_memory;
        this.rom_memory = rom_memory;
        this.color = color;
        this.front_camera = front_camera;
        this.back_camera = back_camera;
        this.chipset = chipset;
        this.battery = battery;
        this.operating_system = operating_system;
        this.cpu = cpu;
        this.image_url = image_url;
        this.offer_url = offer_url;
        this.last_updated = last_updated;
        this.is_validated = is_validated;
        this.offer_description = offer_description;
        this.offer_shop_code = offer_shop_code;
    }
}
