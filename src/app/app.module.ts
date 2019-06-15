import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import 'hammerjs';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule} from 'ngx-pipes';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // to send token to header
import {NgxPaginationModule} from 'ngx-pagination';



// for route
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FileUploadModule } from 'ng2-file-upload';
import { MyOrderByPipe } from './common/pipes/format-data.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';





// for invoice

import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthService } from './auth/shared/auth.service';
import { AuthGuard} from './auth/shared/auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetComponent } from './auth/reset/reset.component';
import { TokenInterceptor} from './auth/shared/token.interceptor';

import { NavbarComponent } from './common/navbar/navbar.component';
import { StreamsComponent } from './streams/streams.component';
import { SideComponent } from './side/side.component';

import { PostFormComponent } from './post-form/post-form.component';
import { PostsComponent } from './posts/posts.component';
import { PostServiceService } from './services/post-service.service';
import { CommentsComponent } from './comments/comments.component';

import { PeopleComponent } from './people/people.component';
import { FriendsService } from './services/friends.service';
import { FollowingComponent } from './following/following.component';
import { NotificationsComponent } from './notifications/notifications.component';

import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import { MessageService } from './services/message.service';
import { ImagesComponent } from './images/images.component';
import { UserViewComponent } from './user-view/user-view.component';
import { ChangePasswordComponent  } from './change-password/change-password.component';
import { PasswordComponent  } from './password/password.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { PostJobComponent } from './post-job/post-job.component';
import { FooterComponent } from './common/footer/footer.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobSearchComponent  } from './job-search/job-search.component';
import { JobDetailComponent  } from './job-detail/job-detail.component';

import { BookmarksComponent } from './dashboard/bookmarks/bookmarks.component';
import { StettingsFreelancerComponent } from './dashboard/stettings-freelancer/stettings-freelancer.component';
import { SettingsEmployeerComponent } from './dashboard/settings-employeer/settings-employeer.component';
import { EmployeerProfileComponent } from './dashboard/employeer-profile/employeer-profile.component';
import { EmployeerProfileEditComponent } from './dashboard/employeer-profile-edit/employeer-profile-edit.component';
import { FreelancerProfileComponent } from './dashboard/freelancer-profile/freelancer-profile.component';
import { FreelanserProfileEditComponent } from './dashboard/freelanser-profile-edit/freelanser-profile-edit.component';
import { CompanyProfileComponent } from './dashboard/company-profile/company-profile.component';
import { ManageJobsComponent } from './dashboard/manage-jobs/manage-jobs.component';
import { ManageCandidatesComponent } from './dashboard/manage-candidates/manage-candidates.component';

const routes: Routes = [
  {path: '', component: StreamsComponent, canActivate: [AuthGuard]},
  {path: 'streams', component: StreamsComponent, canActivate: [AuthGuard]},
  {path: 'comment/:id', component: CommentsComponent , canActivate: [AuthGuard]},
  {path: 'auth', component: AuthComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent} ,
  {path: 'reset/:token', component: ResetComponent},
  {path: 'people', component: PeopleComponent  , canActivate: [AuthGuard]},
  {path: 'following', component: FollowingComponent  , canActivate: [AuthGuard] },
  {path: 'Notifications', component: NotificationsComponent , canActivate: [AuthGuard] },
  {path: 'chat/:id', component: ChatComponent , canActivate: [AuthGuard]},
  {path: 'images/:name', component: ImagesComponent , canActivate: [AuthGuard]},
  
  {path: 'account/password', component: ChangePasswordComponent , canActivate: [AuthGuard]},

  {path: 'post-job', component:  PostJobComponent, canActivate: [AuthGuard]},
  {path: 'jobs', component:  JobsComponent},
  {path: 'job-detail/:jobId', component:  JobDetailComponent},
  {path: 'jobs/:title/:address/:type/homes', component: JobSearchComponent },

  {path: 'dashboard/bookmarks', component: BookmarksComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/settings-freelancer', component: StettingsFreelancerComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/settings-employeer', component: SettingsEmployeerComponent, canActivate: [AuthGuard]}, 
  {path: 'dashboard/profile-employeer', component: EmployeerProfileComponent , canActivate: [AuthGuard]},
  {path: 'dashboard/profile-freelancer', component: FreelancerProfileComponent , canActivate: [AuthGuard]},
  {path: 'dashboard/profile-employeer/:employeeId', component: CompanyProfileComponent , canActivate: [AuthGuard]},
  {path: 'dashboard/manage-jobs/:userId', component: ManageJobsComponent , canActivate: [AuthGuard]},
  {path: 'dashboard/manage-candidates/:jobId', component: ManageCandidatesComponent , canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [

    AppComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetComponent,
    NavbarComponent,
    StreamsComponent,
    SideComponent,
    PostFormComponent,
    PostsComponent,
    CommentsComponent,
    PeopleComponent,
    FollowingComponent,
    NotificationsComponent,
    ChatComponent,
    MessageComponent,
    ImagesComponent,
    UserViewComponent,
    ChangePasswordComponent ,
    PasswordComponent,
    DashboardComponent,
    PostJobComponent,
    FooterComponent,
    JobsComponent,
    JobSearchComponent,
    JobDetailComponent,
    MyOrderByPipe,
    BookmarksComponent,
    StettingsFreelancerComponent,
    SettingsEmployeerComponent,
    EmployeerProfileComponent,
    EmployeerProfileEditComponent,
    FreelancerProfileComponent,
    FreelanserProfileEditComponent,
    CompanyProfileComponent,
    ManageJobsComponent,
    ManageCandidatesComponent

  ],
  imports: [
    RouterModule.forRoot(routes),  // for route
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    NgPipesModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    HttpClientModule,
    MatTableModule,
    MatMenuModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    FileUploadModule,
    NgxEmojiPickerModule.forRoot(),
    NgxPaginationModule,
    NgbModule.forRoot(),
    

  

  ],
  providers: [ MatDatepickerModule,MessageService, AuthService, AuthGuard , PostServiceService,FriendsService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}, //send token to header
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }


