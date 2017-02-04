export interface IUser {
    id: number;
    name: string;
    avatar: string;
    profession: string;
    schedulesCreated: number;
}

export interface ICms {
    id: number;
    title: string;
    avatar: string;
    workItemTypeId: number;
    workItemTypeName: string;
    workItemType: Object;
    qtdFields: number;
    FieldsCreated: number;    
}

export interface ISchedule {
     id: number;
     title: string;
     description: string;
     timeStart: Date;
     timeEnd: Date;
     location: string;
     type: string;
     status: string;
     dateCreated: Date;
     dateUpdated: Date;
     creator: string;
     creatorId: number;
     attendees: number[];
}

//Criar os atributos
export interface IField {
    id: number;
    cmsId: number;
    cms: Object;
    name: string;
    type: string;
    description: string;
    dateCreated: Date;
    dateUpdated: Date;
}

export interface IFieldDetails {
     id: number;
     title: string;
     description: string;
     timeStart: Date;
     timeEnd: Date;
     location: string;
     type: string;
     status: string;
     dateCreated: Date;
     dateUpdated: Date;
     creator: string;
     creatorId: number;
     attendees: IUser[];
     statuses: string[];
     types: string[];
     cmsId: number;
     cms: Object;
     name: string;
}

export interface IScheduleDetails {
     id: number;
     title: string;
     description: string;
     timeStart: Date;
     timeEnd: Date;
     location: string;
     type: string;
     status: string;
     dateCreated: Date;
     dateUpdated: Date;
     creator: string;
     creatorId: number;
     attendees: IUser[];
     statuses: string[];
     types: string[];
}

export interface Pagination {
    CurrentPage : number;
    ItemsPerPage : number;
    TotalItems : number;
    TotalPages: number;
}

export class PaginatedResult<T> {
    result :  T;
    pagination : Pagination;
}

export interface Predicate<T> {
    (item: T): boolean
}