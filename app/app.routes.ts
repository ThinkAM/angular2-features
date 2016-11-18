import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { CmsListComponent } from './cmsies/cms-list.component';
import { ScheduleListComponent } from './schedules/schedule-list.component';
import { ScheduleEditComponent } from './schedules/schedule-edit.component';
import { FieldListComponent } from './fields/field-list.component';
import { FieldEditComponent } from './fields/field-edit.component';

const appRoutes: Routes = [
    { path: 'users', component: UserListComponent },
    { path: 'cmsies', component: CmsListComponent },
    { path: 'schedules', component: ScheduleListComponent },
    { path: 'schedules/:id/edit', component: ScheduleEditComponent },
    { path: 'fields', component: FieldListComponent},
    { path: 'fields/:id/edit', component: FieldEditComponent },
    { path: '', component: HomeComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);