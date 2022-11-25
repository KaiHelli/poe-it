import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss', '../../app.component.scss']
})
export class FilterBarComponent {
  keywordValid = true;
  keywordErrorMessage = '';
  keyword = '';
}
