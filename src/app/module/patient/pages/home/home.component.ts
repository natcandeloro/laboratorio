import { Component } from '@angular/core';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	providers: [NgbCarouselConfig],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
	showNavigationArrows = false;
	showNavigationIndicators = false;
	images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);

	constructor(config: NgbCarouselConfig,
				private router: Router) {
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}

	navigateTo(route: string): void {
		this.router.navigateByUrl(route).then(() => {
			window.scrollTo(0, 0);
		});
	}
}
