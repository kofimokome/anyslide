import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserService} from "../../services/user.service";
import {log} from "util";

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    private edit_id;
    private loading;
    private slides: any[];
    private slide_content: string;

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    }

    ngOnInit() {
        this.loading = true;
        this.slide_content = '';
        this.route.params.subscribe((params: ParamMap) => {
            this.edit_id = params['id'];
            console.log(this.edit_id);
        });
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id
        };
        this.http.post(environment.apiRoot + 'get_slides.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        //console.log(response);
                        this.slides = response.slides;
                        console.log(this.slides);
                        this.loading = false;

                    } else {
                        if (response.code == 404) {
                            this.router.navigate(['/404']);
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

    newSlide() {
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
        };

        this.http.post(environment.apiRoot + 'create_slide.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        console.log(response);
                        this.slides.push({id: response.id, content: ""});

                    } else {
                        console.log(response);
                    }

                },
                (error) => {
                    console.error('Failed decline request ', error);
                },
            );
        this.slides.push(1);
    }
    setContent(content: string){
        this.slide_content = content;
    }

}
