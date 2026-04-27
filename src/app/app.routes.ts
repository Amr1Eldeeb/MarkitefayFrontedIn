import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Product } from './components/product/product';
import { Aboutus } from './components/aboutus/aboutus';
import { NotFound } from './components/not-found/not-found';
import { Vision } from './components/vision/vision';
import { Values } from './components/values/values';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ConfirmEmailComponent } from './components/confirmemail/confirmemail';
import { Details } from './components/details/details';
import { Cart } from './components/cart/cart';
import { authGuard } from './guards/auth-guard';
import { orderComponent } from './components/order/order';
import { HelpCenter } from './components/help-center/help-center';
import { Profile } from './components/profile/profile';

export const routes: Routes = 
[

    {path :'home' , component :Product},
    {path :'profile',component:Profile},
    { path: 'details/:id', component:Details },
    {path:'cart',component:Cart,canActivate:[authGuard]},
    {path :'home' , component :Home},
    {path :'helpcenter',component:HelpCenter},
    {path:'create-order',component:orderComponent,canActivate:[authGuard]},
    {path :'about' , component :Aboutus ,
        children :[
        {path:'',component:Vision},
           
        {path:'vision',component:Vision},
        {path:'values',component:Values}
    ]

    },
{ path: 'login', component: LoginComponent },
{ path: 'register', component:RegisterComponent },
{path:'confirmemail',component:ConfirmEmailComponent},
    {path :'**' , component :NotFound}
     
     



];
