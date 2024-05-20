import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import battleGroups from '../assets/veldt-groups.json';
import rages from '../assets/rages.json';
import bestiary from '../assets/bestiary.json';
import 'bootstrap';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public loading: boolean = true;
  public battleGroups = battleGroups;
  public rages = rages;
  public bestiary = bestiary;
  public obtainedRages: { [key: string]: boolean } = {};
  public obtainedBestiary: { [key: string]: boolean } = {};
  public actualGroupNumber: number = 1;
  public enemySearch: string = '';

  constructor(private firebaseService: FirebaseService){}

  async ngOnInit() {
    if (!(await this.firebaseService.currentUser)) {
      await this.firebaseService.login();
    }
    const userData = await this.firebaseService.getUserData();
    if (userData) {
      const {actualGroupNumber, obtainedBestiary, obtainedRages} = userData;
      this.actualGroupNumber = actualGroupNumber;
      this.obtainedBestiary = obtainedBestiary;
      this.obtainedRages = obtainedRages;
    }
    this.loading = false;
  }

  filterByName() {
    const filtered: {round: number; group: string}[] = [];
    if (this.enemySearch === '') return filtered;
    for (let i = 0; i < this.battleGroups.length; i++) {
      for (const group of this.battleGroups[i]) {
        if (
          group
            .toLocaleLowerCase()
            .indexOf(this.enemySearch.toLocaleLowerCase()) !== -1
        )
          filtered.push({round: i + 1, group});
      }
    }
    return filtered;
  }

  setActualGroupNumber(round: number) {
    if (round < 1 || round > 64) return;
    this.actualGroupNumber = round;
    this.updateStorage();
  }

  addActualGroupNumber(amount: number) {
    const newRoundNumber = this.actualGroupNumber + amount;
    if (newRoundNumber < 1 || newRoundNumber > 64) return;
    this.actualGroupNumber = newRoundNumber;
    this.updateStorage();
  }

  isObtained(enemy: string) {
    const currentKey = Object.keys(this.obtainedRages).find(
      (obtained) =>
        this.removeQty(enemy).toLocaleLowerCase().indexOf(obtained.toLocaleLowerCase()) != -1
    );
    return currentKey && this.obtainedRages[currentKey] === true;
  }

  removeQty(enemy: string) {
    return enemy.replace(/ x\d/ig,'');
  }

  isARage(enemy: string): boolean {
    return rages.find(rage => enemy.toLocaleLowerCase().indexOf(rage.toLocaleLowerCase()) !== -1) !== undefined;
  }

  isInBestiary(enemy: string) {
    const currentKey = Object.keys(this.obtainedBestiary).find(
      (obtained) =>
        this.removeQty(enemy).toLocaleLowerCase().indexOf(obtained.toLocaleLowerCase()) != -1
    );
    return currentKey && this.obtainedBestiary[currentKey] === true;
  }

  badgeColorClass(enemy: string) {
    if (enemy === 'None') return 'text-bg-warning';
    if (!this.isARage(enemy)) return 'text-bg-secondary';
    if (this.isObtained(enemy)) return 'text-bg-success';
    if (this.isInBestiary(enemy)) return 'text-bg-danger';
    return 'text-bg-warning';
  }

  newRageValue(rage: string, value: boolean) {
    this.obtainedRages[rage] = value;
    this.updateStorage();
  }

  newBeastValue(beast: string, value: boolean) {
    this.obtainedBestiary[beast] = value;
    this.updateStorage();
  }

  updateStorage() {
    this.firebaseService.setUserData({
      actualGroupNumber: this.actualGroupNumber,
      obtainedBestiary: this.obtainedBestiary,
      obtainedRages: this.obtainedRages,
    });
  }
}
