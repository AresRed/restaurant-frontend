import { Routes } from '@angular/router';
import { HomeComponent } from './shared/page/home/home.component'; 
import { MenuComponent } from './shared/page/menu/menu.component';
import { WorkUsComponent } from './shared/page/work-us/work-us.component';
export const routes: Routes = [

    {path: 'home',component:HomeComponent},
    {path: 'menu', component:MenuComponent},
    {path: 'workus', component:WorkUsComponent},

    {path: '',redirectTo:'/home', pathMatch:'full'}
];
