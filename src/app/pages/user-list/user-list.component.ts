import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/shared/user.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // entry animation
      transition('void => *', [
				// initial state
				style({
					height: 0,
					opacity: 0,
					transform: 'scale(0.85)',
					'margin-bottom': 0,
					paddingTop: 0,
					paddingBottom: 0,
					paddingLeft: 0,
					paddingRight: 0
				}),
				// animate spacing - height & margin
				animate('50mS', style({
					height: '*',
					'margin-bottom': '*',
					paddingTop: '*',
					paddingBottom: '*',
					paddingLeft: '*',
					paddingRight: '*'
				})),
				animate(68)
			]),

			transition('* => void', [
				// first scale up
				animate(50, style({
					transform: 'scale(1.05)'
				})),
				// scale back to normal size while beginning to fade out
				animate(50, style({
					transform: 'scale(1)',
					opacity: 0.75
				})),
				// scale down and fade out
				animate('120ms ease-out', style({
					transform: 'scale(0.68)',
					opacity: 0
				})),
				// then spacing - height, margin & padding
				animate('150ms ease-out', style({
					height: 0,
					'margin-bottom': 0,
					paddingTop: 0,
					paddingBottom: 0,
					paddingRight: 0,
					paddingLeft: 0,
				}))
			])
		]),
		
		trigger('listAnim', [
			transition('* => *', [
				query(':enter', [
					style({
						opacity: 0,
						height: 0
					}),
					stagger(100, [
						animate('0.3s')
					])
				], {
					optional: true
				})
			])
		])

  ]
})
export class UserListComponent implements OnInit {

	users: User[] = new Array<User>();
	role: string = 'all';
	filteredUsers: User[] = new Array<User>();

	@ViewChild('filterInput') filterElementRef: ElementRef<HTMLInputElement>;
	@ViewChild('filterSelect') ElementRef: ElementRef<HTMLInputElement>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // retrieve all users using UserService
		this.users = this.userService.getAll();
		// this.filteredUsers = this.userService.getAll();
		this.filter('');
  }

  deleteUser(user: User) {
		let userId = this.userService.getId(user);
		this.userService.delete(userId);
		this.filter(this.filterElementRef.nativeElement.value);
	}
	
	generateUserURL(user: User) {
		let userId = this.userService.getId(user);
		return userId;
	}

	onOptionsSelected(value:string){
		this.role = value.toLocaleLowerCase();
	    this.filterElementRef.nativeElement.value = '';
	    this.filter('');
   }


  filter(query: string) {
		query = query.toLowerCase().trim();

		let allResults: User[] = new Array<User>();
		let terms: string[] = query.split(' '); // split on spaces
		terms = this.removeDuplicates(terms);
		// compile all relevent results into the allResults array
		terms.forEach(term => {
			let results: User[] = this.releventUsers(term);
			// append results to the allResults array
			allResults = [...allResults, ...results];
		});

		// remove duplicates from allResults array
		let uniqueResults = this.removeDuplicates(allResults);
		this.filteredUsers = uniqueResults;
		this.sortByRelevancy(allResults);
	}
	
	// Use ES6 sets - only distinct elements allowed in
	removeDuplicates(arr: Array<any>) : Array<any> {
		let uniqueResults: Set<any> = new Set<any>();
		// loop through the input add add the items to the set
		arr.forEach(e => uniqueResults.add(e));

		return Array.from(uniqueResults);
	}

	releventUsers(query: string) : Array<User> {
		query = query.toLowerCase().trim();
			let releventUsers = this.users.filter(user => {				
				if (user.firstname && user.firstname.toLowerCase().includes(query) && (this.role == 'all' || user.role.toLowerCase().includes(this.role))) {
					return true;
				}
				if (user.lastname && user.lastname.toLocaleLowerCase().includes(query) && (this.role == 'all' || user.role.toLowerCase().includes(this.role))) {
					return true;
				}

				if (user.email && user.email.toLocaleLowerCase().includes(query) && (this.role == 'all' || user.role.toLowerCase().includes(this.role))) {
					return true;
				}
			
				return false;
			})

			return releventUsers;

	}

	sortByRelevancy(searchResults) {
		let userCountObj: Object = {};
		
		searchResults.forEach(user => {
			let userId = this.userService.getId(user);

			if (userCountObj[userId]) {
				userCountObj[userId] += 1;
			} else {
				userCountObj[userId] = 1;
			}
		})

		this.filteredUsers = this.filteredUsers.sort((a: User, b: User) => {
			let aId = this.userService.getId(a);
			let bId = this.userService.getId(b);

			let aCount = userCountObj[aId];
			let bCount = userCountObj[bId];

			return bCount - aCount;
		});
	}

}
