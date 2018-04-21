package org.almostscholarly.vsearch;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.almostscholarly.vsearch.services.SearchTokenService;

@RestController
@RequestMapping("/search")
public class SearchController {

    @Autowired
    private SearchTokenService searchTokenService;

    @GetMapping("/")
    public String get() {
        return searchTokenService.get(System.getenv("WATSON_SPEECH_TO_TEXT_USERNAME"), System.getenv("WATSON_SPEECH_TO_TEXT_PASSWORD"));
    }

}
