import { Component, Input, Output, OnInit, ViewContainerRef, EventEmitter, ViewChild,
    trigger,
    state,
    style,
    animate,
    transition  } from '@angular/core';

import { ICms, IField } from '../shared/interfaces';
import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { HighlightDirective } from '../shared/directives/highlight.directive';

import { ModalDirective } from 'ng2-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'cms-card',
    templateUrl: 'cms-card.component.html',
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
export class CmsCardComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @Input() cms: ICms;
    @Output() removeCms = new EventEmitter();
    @Output() cmsCreated = new EventEmitter();

    edittedCms: ICms;
    onEdit: boolean = false;
    apiHost: string;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    cmsFields: IField[];
    cmsFieldsLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;

    constructor(private itemsService: ItemsService,
        private notificationService: NotificationService,
        private dataService: DataService,
        private configService: ConfigService) { }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.edittedCms = this.itemsService.getSerialized<ICms>(this.cms);
        if (this.cms.id < 0)
            this.editCms();
    }

    editCms() {
        this.onEdit = !this.onEdit;
        this.edittedCms = this.itemsService.getSerialized<ICms>(this.cms);
        // <ICms>JSON.parse(JSON.stringify(this.cms)); // todo Utils..
    }   

    createCms() {
        //this.slimLoader.start();
        this.dataService.createCms(this.edittedCms)
            .subscribe((cmsCreated) => {
                this.cms = this.itemsService.getSerialized<ICms>(cmsCreated);
                this.edittedCms = this.itemsService.getSerialized<ICms>(this.cms);
                this.onEdit = false;

                this.cmsCreated.emit({ value: cmsCreated });
                //this.slimLoader.complete();
            },
            error => {
                this.notificationService.printErrorMessage('Falha para criar o CMS');
                this.notificationService.printErrorMessage(error);
                //this.slimLoader.complete();
            });
    }

    updateCms() {
        //this.slimLoader.start();
        this.dataService.updateCms(this.edittedCms)
            .subscribe(() => {
                this.cms = this.edittedCms;
                this.onEdit = !this.onEdit;
                this.notificationService.printSuccessMessage(this.cms.titulo + ' foi atualizado com sucesso');
                //this.slimLoader.complete();
            },
            error => {
                this.notificationService.printErrorMessage('Falha para editar o CMS');
                this.notificationService.printErrorMessage(error);
                //this.slimLoader.complete();
            });
    }

    openRemoveModal() {
        this.notificationService.openConfirmationDialog('Tem certeza que quer remover o  '
            + this.cms.titulo + '?',
            () => {
                //this.slimLoader.start();
                this.dataService.deleteCms(this.cms.id)
                    .subscribe(
                    res => {
                        this.removeCms.emit({
                            value: this.cms
                        });
                        //this.slimLoader.complete();
                        //this.slimLoader.complete();
                    }, error => {
                        this.notificationService.printErrorMessage(error);
                        //this.slimLoader.complete();
                    })
            });
    }

    //Dar continuidade
    viewFields(cms: ICms) {
        console.log(cms);
        this.dataService.getCmsFields(this.edittedCms.id)
            .subscribe((fields: IField[]) => {
                this.cmsFields = fields;
                console.log(this.cmsFields);
                this.cmsFieldsLoaded = true;
                this.childModal.show();
                //this.slimLoader.complete();
            },
            error => {
                //this.slimLoader.complete();
                this.notificationService.printErrorMessage('Falha ao carregar CMS. ' + error);
            });
        
    }

    public hideChildModal(): void {
        this.childModal.hide();
    }

    opened() {
        //this.slimLoader.start();
        this.dataService.getCmsFields(this.edittedCms.id)
            .subscribe((fields: IField[]) => {
                this.cmsFields = fields;
                console.log(this.cmsFields);
                this.cmsFieldsLoaded = true;
                //this.slimLoader.complete();
            },
            error => {
                //this.slimLoader.complete();
                this.notificationService.printErrorMessage('Falha ao carregar CMS. ' + error);
            });
        this.output = '(opened)';
    }

    isUserValid(): boolean {
        return !(this.edittedCms.titulo.trim() === "")
           /* && !(this.edittedCms.profession.trim() === "");*/
    }

}