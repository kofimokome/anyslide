import {Component, OnInit} from '@angular/core';
import * as Reveal from "../../../node_modules/reveal.js"
import {SocketService} from "../services/socket.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-presentation',
    templateUrl: './presentation.component.html',
    styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit {
    private socket;
    private notguest;
    private reveal;
    private fromsocket;

    constructor(private socketService: SocketService, private route: ActivatedRoute) {
        this.socket = socketService.getSocket();
        this.reveal = Reveal;
    }

    ngOnInit() {
        this.fromsocket = false;

        this.route.data
            .subscribe((data) => {
                console.log(data);
                this.notguest = data.notguest;
            });
        this.addScript();
        this.startPresentation();
        this.sockets();
    }

    private startPresentation() {
        this.reveal.initialize({
            controls: this.notguest,
            progress: true,
            history: true,
            center: true,
            overview: true,
            keyboard: this.notguest,
            transition: 'slide', // none/fade/slide/convex/concave/zoom\n" +
            // More info https://github.com/hakimel/reveal.js#dependencies\n" +
            dependencies: [
                {
                    src: '../../../node_modules/reveal.js/lib/js/classList.js', condition: function () {
                        return !document.body.classList;
                    }
                },
                {
                    src: '../../../node_modules/reveal.js/plugin/markdown/marked.js', condition: function () {
                        return !!document.querySelector('[data-markdown]');
                    }
                },
                {
                    src: '../../../node_modules/reveal.js/plugin/markdown/markdown.js', condition: function () {
                        return !!document.querySelector('[data-markdown]');
                    }
                },
                {src: '../../../node_modules/reveal.js/plugin/search/search.js', async: true},
                {src: '../../../node_modules/reveal.js/plugin/zoom-js/zoom.js', async: true},
                {src: '../../../node_modules/reveal.js/plugin/notes/notes.js', async: true}
            ]
        });
        if (this.notguest) {
            let self = this;
            this.reveal.addEventListener('slidechanged', function (event) {
                // event.previousSlide, event.currentSlide, event.indexh, event.indexv
                self.socket.emit("test_present", event.indexh, event.indexv, event.indexf);
            });
        }

    }

    private addScript() {
        let head = <HTMLDivElement> document.head;
        let style = document.createElement('link');
        style.rel = "stylesheet";
        style.href = "../node_modules/reveal.js/css/reveal.css";
        style.id = "theme";
        head.append(style);

        style = document.createElement('link');
        style.rel = "stylesheet";
        style.href = "../node_modules/reveal.js/css/theme/black.css";
        head.append(style);
        /*let body = <HTMLDivElement> document.body;
        let script = document.createElement('script');

        script = document.createElement('script');
        script.innerHTML = "Reveal.initialize({\n" +
            "        controls: true,\n" +
            "        progress: true,\n" +
            "        history: true,\n" +
            "        center: true,\n" +
            "        transition: 'slide', // none/fade/slide/convex/concave/zoom\n" +
            "        // More info https://github.com/hakimel/reveal.js#dependencies\n" +
            "        dependencies: [\n" +
            "            { src: '../node_modules/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },\n" +
            "            { src: '../node_modules/reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },\n" +
            "            { src: '../node_modules/reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },\n" +
            "            { src: '../node_modules/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },\n" +
            "            { src: '../node_modules/reveal.js/plugin/search/search.js', async: true },\n" +
            "            { src: '../node_modules/reveal.js/plugin/zoom-js/zoom.js', async: true },\n" +
            "            { src: '../node_modules/reveal.js/plugin/notes/notes.js', async: true }\n" +
            "        ]\n" +
            "    });";
        //script.async = true;
        //script.defer = true;
        body.appendChild(script);*/

    }

    nextSlide() {
        this.reveal.next();
    }

    prevSlide() {
        this.reveal.prev();
    }

    sockets() {

        let self = this;
        this.socket.on("testpresent", function (e) {
            console.log(e);
            self.reveal.slide(e.indexh, e.indexv, e.indexf);
        });


        // all sockets go here
    }
}
