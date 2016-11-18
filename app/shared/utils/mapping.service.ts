import { Injectable } from '@angular/core';

import { ISchedule, IScheduleDetails, IUser, IField, IFieldDetails } from '../interfaces';
import  { ItemsService } from './items.service'

@Injectable()
export class MappingService {

    constructor(private itemsService : ItemsService) { }

    mapScheduleDetailsToSchedule(scheduleDetails: IScheduleDetails): ISchedule {
        var schedule: ISchedule = {
            id: scheduleDetails.id,
            title: scheduleDetails.title,
            description: scheduleDetails.description,
            timeStart: scheduleDetails.timeStart,
            timeEnd: scheduleDetails.timeEnd,
            location: scheduleDetails.location,
            type: scheduleDetails.type,
            status: scheduleDetails.status,
            dateCreated: scheduleDetails.dateCreated,
            dateUpdated: scheduleDetails.dateUpdated,
            creator: scheduleDetails.creator,
            creatorId: scheduleDetails.creatorId,
            attendees: this.itemsService.getPropertyValues<IUser, number[]>(scheduleDetails.attendees, 'id')
        }

        return schedule;
    }

    mapFieldDetailsToField(fieldDetails: IFieldDetails): IField{
        var field: IField = {
            id: fieldDetails.id,
            name: fieldDetails.name,
            //title: fieldDetails.title,
            description: fieldDetails.description,
            cmsId: fieldDetails.cmsId,
            cms: fieldDetails.cms,
            //timeStart: fieldDetails.timeStart,
            //timeEnd: fieldDetails.timeEnd,
            //location: fieldDetails.location,
            type: fieldDetails.type,
            //status: fieldDetails.status,
            dateCreated: fieldDetails.dateCreated,
            dateUpdated: fieldDetails.dateUpdated,
            //creator: fieldDetails.creator,
            //creatorId: fieldDetails.creatorId,
           // attendees: this.itemsService.getPropertyValues<IUser, number[]>(fieldDetails.attendees, 'id')
        }
        return field;
    }

}

//aqui so tem o mapping do shedule, vai ter que ter do field e do cms tbm ???