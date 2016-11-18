import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { MappingService } from '../shared/utils/mapping.service';
import { IField, IFieldDetails, ICms } from '../shared/interfaces';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';

@Component({
    moduleId: module.id,
    selector: 'app-field-edit', // MudeiAqui
    templateUrl: 'field-edit.component.html'
})
export class FieldEditComponent implements OnInit {
    apiHost: string;
    id: number;
    field: IFieldDetails; //Vai ter que criar um Details
    fieldLoaded: boolean = false; // Vai ter que criar um Loaded
    statuses: string[];
    types: string[];
    private sub: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        private mappingService: MappingService,
        private loadingBarService:SlimLoadingBarService) { }

    ngOnInit() {
        // (+) converts string 'id' to a number
	    this.id = +this.route.snapshot.params['id'];
        this.apiHost = this.configService.getApiHost();
        this.loadFieldDetails();
    }

    // Aqui vai ter quye ser Fields
    loadFieldDetails() {
        //teste
        this.loadingBarService.start();
        this.dataService.getFieldDetails(this.id)
            .subscribe((field: IFieldDetails) => {
                this.field = this.itemsService.getSerialized<IFieldDetails>(field);
                this.fieldLoaded = true;
                // Convert date times to readable format
                this.field.timeStart = new Date(this.field.timeStart.toString()); // new DateFormatPipe().transform(schedule.timeStart, ['local']);
                this.field.timeEnd = new Date(this.field.timeEnd.toString()); //new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                this.statuses = this.field.statuses;
                this.types = this.field.types;

                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Falha ao carregar Field ' + error);
            });
    }
    //nessa parte aqui, vai ser tudo updateFields né ?
    updateField(editFieldForm: NgForm) {
        console.log(editFieldForm.value);

        var fieldMapped = this.mappingService.mapFieldDetailsToField(this.field);

        this.loadingBarService.start();
        this.dataService.updateField(fieldMapped)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('Field não foi atualizado');
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Field não foi atualizado. ' + error);
            });
    }

    //Aqui nos atendimentos, acho que agente vai retirar ne ?
    // removeAttendee(attendee: Icms) {
    //     this.notificationService.openConfirmationDialog('Are you sure you want to remove '
    //         + attendee.name + ' from this schedule?',
    //         () => {
    //             this.loadingBarService.start();
    //             this.dataService.deleteScheduleAttendee(this.schedule.id, attendee.id)
    //                 .subscribe(() => {
    //                     this.itemsService.removeItemFromArray<IUser>(this.schedule.attendees, attendee);
    //                     this.notificationService.printSuccessMessage(attendee.name + ' will not attend the schedule.');
    //                     this.loadingBarService.complete();
    //                 },
    //                 error => {
    //                     this.loadingBarService.complete();
    //                     this.notificationService.printErrorMessage('Failed to remove ' + attendee.name + ' ' + error);
    //                 });
    //         });
    // }

    back() {
        this.router.navigate(['/fields']);
    }

}