import {Component, OnInit} from '@angular/core';
import * as Reveal from "../../../../node_modules/reveal.js"
import {SocketService} from "../../services/socket.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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
    private presentation_id;
    public loading;
    private presentation_content: string;
    public slides;
    private presentation_link;

    constructor(private socketService: SocketService, private route: ActivatedRoute, private http: HttpClient, private router: Router) {
        this.socket = socketService.getSocket();
        this.reveal = Reveal;
    }

    ngOnInit() {
        this.fromsocket = false;
        this.loading = true;
        this.presentation_content = '';

        this.route.data
            .subscribe((data) => {
                console.log(data);
                this.notguest = data.notguest;
            });
        this.route.params.subscribe((params: ParamMap) => {
            this.presentation_link = params['id'];
            console.log(this.presentation_link);
        });
        this.socket.emit("join_presentation", this.presentation_link, false);
        //this.getSlides();
        this.sockets();
        //this.addScript();
        //this.startPresentation();
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
            /*dependencies: [
                {
                    src: 'node_modules/reveal.js/lib/js/classList.js', condition: function () {
                        return !document.body.classList;
                    }
                },
                {
                    src: 'node_modules/reveal.js/plugin/markdown/marked.js', condition: function () {
                        return !!document.querySelector('[data-markdown]');
                    }
                },
                {
                    src: 'node_modules/reveal.js/plugin/markdown/markdown.js', condition: function () {
                        return !!document.querySelector('[data-markdown]');
                    }
                },
                {src: 'node_modules/reveal.js/plugin/search/search.js', async: true},
                {src: 'node_modules/reveal.js/plugin/zoom-js/zoom.js', async: true},
                {src: 'node_modules/reveal.js/plugin/notes/notes.js', async: true}
            ]*/
        });
        if (this.notguest) {
            let self = this;
            this.reveal.addEventListener('slidechanged', function (event) {
                // event.previousSlide, event.currentSlide, event.indexh, event.indexv
                if (!self.fromsocket) {
                    self.socket.emit("update_presentation", self.presentation_link, event.indexh, event.indexv, event.indexf);
                } else {
                    self.fromsocket = !self.fromsocket;
                }
            });
        }

    }

    private addScript() {
        let head = <HTMLDivElement> document.head;
        let style = document.createElement('link');
        style.rel = "stylesheet";
        style.href = "https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/css/reveal.min.css";
        //style.href = "../node_modules/reveal.js/css/reveal.css";
        style.id = "theme";
        head.append(style);

        style = document.createElement('link');
        style.rel = "stylesheet";
        style.href = "https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/css/theme/black.min.css";
        //style.href = "../node_modules/reveal.js/css/theme/black.css";
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

    getSlides() {
        let data = {
            // user_id: UserService.getUserId(),
            presentation_id: this.presentation_id,
            //presentation_id: 1,
            type: 'view',
        };
        this.http.post(environment.apiRoot + 'get_slides.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        console.log(response);
                        this.slides = response.slides;
                        this.addScript();
                        //this.loading = false;
                        this.startPresentation();
                        //console.log(this.slides);

                    } else {
                        if (response.code == 404) {
                            //this.router.navigate(['/404']);
                        } else {
                            console.log(response);
                        }
                    }
                },
                (error) => {
                    console.error('Failed decline request ', error);
                },
            );
    }

    sockets() {

        let self = this;
        /*this.socket.on("testpresent", function (e) {
            console.log(e);
            self.reveal.slide(e.indexh, e.indexv, e.indexf);
        });*/


        this.socket.on("joinPresentation", (response) => {
            console.log(response);
            if (response.status) {
                this.presentation_id = response.id;
                this.getSlides();

            } else {
                this.router.navigate(['/404']);
            }
        });

        this.socket.on("update_slide", (e) => {
            this.reveal.slide(e.indexh, e.indexv, e.indexf);
            this.fromsocket = true;
        });

        this.socket.on("leavePresentation", (e) => {
            //this.router.navigate(['/404']);
            window.location.assign('/404');
        })
        // all sockets go here
    }
}
