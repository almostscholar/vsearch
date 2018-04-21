import { Component, NgZone } from '@angular/core';
import { recognizeMicrophone } from 'watson-speech/speech-to-text';
import { HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    state: string;
    message: string = 'Connecting to Skynet... please wait...';
    input: string = '';
    currentStream: any;

    constructor(private _zone: NgZone) {
        this.state = 'waiting';
    }

    ngOnInit() {
        if (this.state !== 'waiting') {
            this.currentStream.stop();
            this.state = 'waiting';
        }
        this._initiateSpeechToText();
    }

    setState(state: string): void {
        this.state = state;
    }

    setMessage(message: string): void {
        this._zone.run(() => {
            this.message = message;
        });
    }

    setInput(input: string): void {
        this._zone.run(() => {
            this.input = input;
        });
    }

    _initiateSpeechToText(): void {

        fetch('/search/')
        .then((response) => {
            this.message = 'Reticulating Splines...';
            return response.text();
        })
        .then((token) => {
            let stream = recognizeMicrophone({
                token: token,
                objectMode: true,
                extractResults: true,
                format: false
            });

            this.currentStream = stream;
            this.setMessage('Connected to Skynet.  Say "Computer" to begin or "Stop" to close connection.');
            this.setState('ready');

            stream.on('data', (data) => {
                if (this.state === 'complete') {
                    stream.stop();
                    this.state = 'waiting';
                } else {
                    let isFinal = data.final;
                    let text = data.alternatives[0].transcript.toLowerCase().trim();
                    this.setInput(text);

                    if (isFinal && text === 'stop') {
                        stream.stop();
                        this.setState('complete');
                        this.setMessage('Unlike The T-800, I Have Self Terminated');
                    }

                    if (this.state === 'ready' && isFinal && text === 'computer') {
                        this.setState('primed');
                        this.setMessage('I am listening -- Speak your desire');
                    } else if (this.state === 'primed' && isFinal) {
                        this.setState('complete');
                        this.setMessage('Processing Request: ' + text);

                        let redirectUrl = 'http://letmegooglethat.com/?q=' + text.trim().replace(' ', '+');
                        window.location.href = redirectUrl;
                    }
                }
            });
            stream.on('error', (err) => {
                console.log(err);
            });
        })
        .catch(function(error) {
            console.log(error);
        });

    }


}
