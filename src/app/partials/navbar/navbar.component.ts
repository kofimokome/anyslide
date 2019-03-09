import {Component, Output, OnInit, EventEmitter, ViewChild} from '@angular/core';
import {HomeComponent} from "../../pages/home/home.component";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    @Output() messageEvent = new EventEmitter<string>();
    @ViewChild(HomeComponent) child;
    public isregister;

    constructor() {
    }

    ngOnInit() {
        this.isregister = false;
    }

    switch_buttons() {
        this.isregister = !this.isregister;
    }

    ngAfterViewInit() {
        //this.isregister = this.child.isregister;
       // console.log(this.child.isregister);
    }

    sendMessage() {
        this.messageEvent.emit();
        this.switch_buttons();
    }


}
