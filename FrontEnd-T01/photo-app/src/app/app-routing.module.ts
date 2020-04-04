import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { LogInComponent } from './log-in/log-in.component';
import { IdvCardComponent } from './idv-card/idv-card.component';





const routes: Routes = [
  {path:'', component:FeedComponent},
  {path:'profile', component:ProfileComponent},
  {path:'updateUser', component:UpdateProfileComponent},
  {path:'login', component:LogInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
