package org.almostscholarly.vsearch.services;

import org.springframework.stereotype.Service;
import com.ibm.watson.developer_cloud.speech_to_text.v1.SpeechToText;
import com.ibm.watson.developer_cloud.http.ServiceCall;

@Service
public class SearchTokenService {

    public String get(String username, String password) {
        SpeechToText service = new SpeechToText(username, password);
        ServiceCall<String> tokenCall = service.getToken();
        return tokenCall.execute();
    }

}
