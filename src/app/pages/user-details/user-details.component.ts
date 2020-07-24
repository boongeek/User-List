import { Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import { NgForm } from "@angular/forms";
import { User } from "src/app/shared/user.model";
import { UserService } from "src/app/shared/user.service";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.scss"],
})
export class UserDetailsComponent implements OnInit {
  user: User;
  userId: number;
  new: boolean;
  managerExist: boolean;
  emailExist: boolean;
  storedUsers: User[] = new Array<User>();

  @ViewChild('filterInput') filterElementRef: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // new user or editing existing one?
    this.route.params.subscribe((params: Params) => {
      this.user = new User();
      if (params.id) {
        this.user = this.userService.get(params.id);
        this.userId = params.id;
        this.new = false;
      } else {
        this.new = true;
      }
    });

     // retrieve all users using UserService
     this.storedUsers = this.userService.getAll();

  }

  onOptionsSelected(value:string){
    this.managerExist = false;
   if (value == 'Manager') {
     this.storedUsers.filter(user => {				
      if (user.role && (user.role.toLowerCase() == 'manager')) {
        this.managerExist = true;
        return true;
      }
        return false;
      })

    }

  }

filter(ev){
     this.emailExist = false;
     this.storedUsers.filter(user => {				
      if (user.email && (user.email.toLowerCase() == ev.toLowerCase())) {
        this.emailExist = true;
        return true;
      }
        return false;
      })

}

  onSubmit(form: NgForm) {
    if (this.new) {
      // save user
   this.userService.add(form.value); 
    } else {
      this.userService.update(this.userId, form.value.firstname, form.value.lastname, form.value.email, form.value.role);
    }
    this.router.navigateByUrl("/");
  }

  cancel() {
    this.router.navigateByUrl("/");
  }
}
