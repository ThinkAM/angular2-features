import { Component, OnInit, ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition } from '@angular/core';

import { ModalDirective } from 'ng2-bootstrap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { DataService } from '../shared/services/data.service';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { IField, IFieldDetails, Pagination, PaginatedResult } from '../shared/interfaces';

@Component({
    moduleId: module.id,
    selector: 'app-field',
    templateUrl: 'field-list.component.html',
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.5s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})
export class FieldListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    fields: IField[];
    apiHost: string;

    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;

    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedFieldId: number;
    fieldDetails: IFieldDetails;
    selectedFieldLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;

    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        private loadingBarService:SlimLoadingBarService) { }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.loadField();
    }

    loadField() {
        this.loadingBarService.start();

        this.dataService.getFields(this.currentPage, this.itemsPerPage)
            .subscribe((res: PaginatedResult<IField[]>) => {
                this.fields = res.result;// fields;
                this.totalItems = res.pagination.TotalItems;
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Falha ao carregar os Fields. ' + error);
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        this.loadField();
        //console.log('Page changed to: ' + event.page);
        //console.log('Number items per page: ' + event.itemsPerPage);
    };

    removeField(field: IField) {
        this.notificationService.openConfirmationDialog('Tem certeza que quer apagar esse field ?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteField(field.id)
                    .subscribe(() => {
                        this.itemsService.removeItemFromArray<IField>(this.fields, field);
                        this.notificationService.printSuccessMessage(field.name + ' foi deletado.');
                        this.loadingBarService.complete();
                    },
                    error => {
                        this.loadingBarService.complete();
                        this.notificationService.printErrorMessage('Falha para deletar ' + field.name + ' ' + error);
                    });
            });
    }

    viewfieldDetails(id: number) {
        this.selectedFieldId = id;

        this.dataService.getFieldDetails(this.selectedFieldId)
            .subscribe((field: IFieldDetails) => {
                this.fieldDetails = this.itemsService.getSerialized<IFieldDetails>(field);
                // Convert date times to readable format
                this.fieldDetails.timeStart = new DateFormatPipe().transform(field.timeStart, ['local']);
                this.fieldDetails.timeEnd = new DateFormatPipe().transform(field.timeEnd, ['local']);
                this.loadingBarService.complete();
                this.selectedFieldLoaded = true;
                this.childModal.show();//.open('lg');
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Falha para carregar o field. ' + error);
            });
    }

    public hideChildModal(): void {
        this.childModal.hide();
    }
}