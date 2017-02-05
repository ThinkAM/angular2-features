import { Component, OnInit } from '@angular/core';

import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ICms } from '../shared/interfaces';
import { CmsCardComponent } from './cms-card.component';

@Component({
    moduleId: module.id,
    selector: 'cmsies',
    templateUrl: 'cms-list.component.html'
})
export class CmsListComponent implements OnInit {

    cmsies: ICms[];
    addingUser: boolean = false;

    constructor(private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        this.dataService.getCmsies()
            .subscribe((cmsies: ICms[]) => {
                this.cmsies = cmsies;
            },
            error => {
                this.notificationService.printErrorMessage('Falha ao carregar CMS. ' + error);
            });
    }

    removeCms(cms: any) {
        var _cms: ICms = this.itemsService.getSerialized<ICms>(cms.value);
        this.itemsService.removeItemFromArray<ICms>(this.cmsies, _cms);
        // inform user
        this.notificationService.printSuccessMessage(_cms.title + ' foi removido com sucesso!');
    }

    cmsCreated(cms: any) {
        var _cms: ICms = this.itemsService.getSerialized<ICms>(cms.value);
        this.addingUser = false;
        // inform user
        this.notificationService.printSuccessMessage(_cms.title + ' foi criado com sucesso!');
        console.log(_cms.id);
        this.itemsService.setItem<ICms>(this.cmsies, (u) => u.id == -1, _cms);
        // todo fix user with id:-1
    }

    addCms() {
        this.addingUser = true;
        
        var newCms = { 
            id: -1, 
            titulo: '', 
            avatar: 'avatar_05.png', 
            workItemTypeId: 0, 
            workItemType: {}, 
            qtdeField: 0, 
            fieldsCreated: 0 
        };

        this.itemsService.addItemToStart<ICms>(this.cmsies, newCms);
        //this.cmsies.splice(0, 0, newCms);
    }

    cancelAddCms() {
        this.addingUser = false;
        this.itemsService.removeItems<ICms>(this.cmsies, x => x.id < 0);
    }
}