import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'search-bar',
  imports: [InputTextModule, FormsModule, ButtonModule],
  templateUrl: './search-bar.html'
})
export class SearchBar {
  city: string = '';
  search = output<string>();

  onSearch() {
    if (this.city === '') return;
    if (this.city.trim()) this.search.emit(this.city);
  }
}
