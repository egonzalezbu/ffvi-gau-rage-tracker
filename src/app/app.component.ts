import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import battleGroups from '../assets/veldt-groups.json';
import rages from '../assets/rages.json';
import bestiary from '../assets/bestiary.json';
import 'bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public battleGroups = battleGroups;
  public rages = rages;
  public bestiary = bestiary;
  public obtainedRages: { [key: string]: boolean } = {};
  public obtainedBestiary: { [key: string]: boolean } = {};
  public actualGroupNumber: number = 1;
  public enemySearch: string = '';

  ngOnInit(): void {
    this.readStorage();
  }

  filterByName() {
    const filtered: string[] = [];
    if (this.enemySearch === '') return filtered;
    for (let i = 0; i < this.battleGroups.length; i++) {
      for (const group of this.battleGroups[i]) {
        if (
          group
            .toLocaleLowerCase()
            .indexOf(this.enemySearch.toLocaleLowerCase()) !== -1
        )
          filtered.push(`Ronda ${i + 1}: ${group}`);
      }
    }
    return filtered;
  }

  isObtained(enemy: string) {
    const currentKey = Object.keys(this.obtainedRages).find(
      (obtained) =>
        enemy.toLocaleLowerCase().indexOf(obtained.toLocaleLowerCase()) != -1
    );
    return currentKey && this.obtainedRages[currentKey] === true;
  }

  isInBestiary(enemy: string) {
    const currentKey = Object.keys(this.obtainedBestiary).find(
      (obtained) =>
        enemy.toLocaleLowerCase().indexOf(obtained.toLocaleLowerCase()) != -1
    );
    return currentKey && this.obtainedBestiary[currentKey] === true;
  }

  newRageValue(rage: string, value: boolean) {
    this.obtainedRages[rage] = value;
    this.updateStorage();
  }

  newBeastValue(beast: string, value: boolean) {
    this.obtainedBestiary[beast] = value;
    this.updateStorage();
  }

  readStorage() {
    try {
      this.obtainedRages = JSON.parse(
        localStorage.getItem('obtainedRages') as string
      );
      if (!this.obtainedRages) this.obtainedRages = {};
    } catch (_) {
      this.obtainedRages = {};
    }
    try {
      this.obtainedBestiary = JSON.parse(
        localStorage.getItem('obtainedBestiary') as string
      );
      if (!this.obtainedBestiary) this.obtainedBestiary = {};
    } catch (_) {
      this.obtainedBestiary = {};
    }
  }

  updateStorage() {
    localStorage.setItem('obtainedRages', JSON.stringify(this.obtainedRages));
    localStorage.setItem(
      'obtainedBestiary',
      JSON.stringify(this.obtainedBestiary)
    );
  }
}
