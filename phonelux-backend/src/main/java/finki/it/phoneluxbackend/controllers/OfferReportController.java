package finki.it.phoneluxbackend.controllers;

import finki.it.phoneluxbackend.entities.OfferReport;
import finki.it.phoneluxbackend.services.OfferReportService;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/offerreport")
public class OfferReportController {
    private final OfferReportService offerReportService;

    @GetMapping(path = "/allreports")
    public List<OfferReport> getAllOfferReports(){
        return offerReportService.getAllOfferReports();
    }

    @PostMapping(path = "/{offerId}/{userId}")
    public ResponseEntity<Object> reportOffer(@PathVariable("offerId") Long offerId,
                                              @PathVariable("userId") Long userId){

        return offerReportService.reportOffer(offerId, userId);
    }

    @DeleteMapping(path = "/remove/{offerReportId}")
    public ResponseEntity<Object> removeOfferReport(@PathVariable("offerReportId") Long offerReportId){

        return offerReportService.removeOfferReport(offerReportId);
    }

    @DeleteMapping(path = "/removeall")
    public ResponseEntity<Object> removeAllOfferReports(){

        return offerReportService.removeAllOfferReports();
    }



}
