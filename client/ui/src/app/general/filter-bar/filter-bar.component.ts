import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AppConfig} from "../../config/app.config";
import {ENTER} from "@angular/cdk/keycodes";
import {MatChipEditedEvent, MatChipInputEvent} from "@angular/material/chips";

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss', '../../app.component.scss']
})
export class FilterBarComponent implements OnInit {
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER] as const;

  keywordValid = true;
  keywordErrorMessage = '';
  keyword = '';

  @Output() keywordsChanged = new EventEmitter();
  @Output() sortingChanged = new EventEmitter();
  @Output() filterChanged = new EventEmitter();
  @Output() keywords: string[] = [];
  @Output() sorting: string = AppConfig.APP_DEFAULTS.sorting;
  @Output() filter: string[] = [];

  constructor() {
  }

  ngOnInit():void {
  }

  onSortingChange(value: string): void {
    this.sorting = value;
    this.sortingChanged.emit(value);
  }

  onFilterChanged(value: string[]): void {
    this.filter = value;
    this.filterChanged.emit(value);
  }

  onKeywordAdd(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.keywordsChanged.emit(this.keywords);
  }

  onKeywordRemove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }

    this.keywordsChanged.emit(this.keywords);
  }

  onKeywordEdit(keyword: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove keyword if it no longer has a name
    if (!value) {
      this.onKeywordRemove(keyword);
      return;
    }

    // Edit existing keyword
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords[index] = value;
    }

    this.keywordsChanged.emit(this.keywords);
  }
}
