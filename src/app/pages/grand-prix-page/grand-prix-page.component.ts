import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebService } from 'src/app/services/web/web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RaceEvent } from 'src/app/models/RaceEvent.model';
import { ThemeService } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { RaceResult } from 'src/app/models/RaceResult.model';
import { Standing } from 'src/app/models/Standing.model';

@Component({
  selector: 'grand-prix-page',
  templateUrl: './grand-prix-page.component.html',
  styleUrls: ['./grand-prix-page.component.scss']
})
export class GrandPrixPageComponent implements OnInit, OnDestroy {

  season: number = new Date().getFullYear();
  round: number = 1;
  circuitDetails:RaceEvent[];
  raceResult:RaceResult;
  driverStanding: Standing[];
  teamStanding: Standing[];
  
  nextSeasonButtonDisabled: boolean = true;
  prevSeasonButtonDisabled: boolean = true;
  nextGPButtonDisabled: boolean = true;
  prevGPButtonDisabled: boolean = true;
  maxRaces:number;

  circuitSubscripton:Subscription;
  raceResultSubscription:Subscription;
  driverStandingSubscription:Subscription;
  teamStandingSubscription:Subscription;

isCurrentRaceLoading:boolean=true;
isRaceResultLoading:boolean=true;
isDriverStandingLoading:boolean=true;
isTeamStandingLoading:boolean=true;

  constructor(private webService: WebService, private route: ActivatedRoute, private router: Router) {
      this.route.queryParams.subscribe(params => {
        if (params && params.season) {
          if (params.season >= 1950 && params.season <= new Date().getFullYear()) {
            this.season = params.season;
            if(params.round && params.round>=1){
              this.round=params.round;
              this.checkMaxNumberOfRaces(this.season.toString());   
            }
            else{
              this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season, round: this.round } });
            }
          }
          else {
            this.season = new Date().getFullYear();
            this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season, round: this.round } });
          }
           
        }
        else{
          this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season, round: this.round } });
        }
        this.setDefaultGPNavButtons(this.round);   
      
        
        
      });
  
  }

  ngOnInit(): void {
    this.setDefaultSeasonNavButtons(this.season); 
  }

  setDefaultSeasonNavButtons(season: number) {
    if (season == new Date().getFullYear()) {
      this.prevSeasonButtonDisabled = false;
      this.nextSeasonButtonDisabled = true;
    }
    else if (season == 1950) {
      this.prevSeasonButtonDisabled = true;
      this.nextSeasonButtonDisabled = false;
    }
    else {
      this.prevSeasonButtonDisabled = false;
      this.nextSeasonButtonDisabled = false;
    }
  }

  setDefaultGPNavButtons(round: number) {
    if (round == this.maxRaces) {
      this.prevGPButtonDisabled = false;
      this.nextGPButtonDisabled = true;
    }
    else if (round == 1) {
      this.prevGPButtonDisabled = true;
      this.nextGPButtonDisabled = false;
    }
    else {
      this.prevGPButtonDisabled = false;
      this.nextGPButtonDisabled = false;
    }
  }

  prevSeason() {
    if (this.season > 1950) {
      this.season--;

      this.nextSeasonButtonDisabled = false;
      this.prevSeasonButtonDisabled = false;
      if (this.season == 1950) {
        this.prevSeasonButtonDisabled = true;

      }
      else {
        this.nextSeasonButtonDisabled = false;
        this.prevSeasonButtonDisabled = false;
      }
    }

    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season, round:1 } });
  }

  nextSeason() {
    const currentYear = new Date().getFullYear();
    if (this.season < currentYear) {
      this.season++;

      if (this.season == currentYear) {
        this.nextSeasonButtonDisabled = true;
      }
      else {

        this.nextSeasonButtonDisabled = false;
        this.prevSeasonButtonDisabled = false;
      }

    }
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season, round:1 } });
  }


  prevGP() {
    if (this.round > 1) {
      this.round--;

      this.nextGPButtonDisabled = false;
      this.prevGPButtonDisabled = false;
      if (this.round == 1) {
        this.prevGPButtonDisabled = true;

      }
      else {
        this.nextGPButtonDisabled = false;
        this.prevGPButtonDisabled = false;
      }
    }    
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season, round: this.round } });
  }

  nextGP() {
    if (this.round < this.maxRaces) {
      this.round++;

      if (this.round == this.maxRaces) {
        this.nextGPButtonDisabled = true;
      }
      else {

        this.nextGPButtonDisabled = false;
        this.prevGPButtonDisabled = false;
      }

    }
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season, round: this.round } });
  }

  checkMaxNumberOfRaces(season:string){
    this.isCurrentRaceLoading=true;
  
    this.circuitSubscripton=this.webService.getCircuits(season).subscribe(res => {
      this.maxRaces=res.length;
      this.circuitDetails=res; 
      if(this.round>this.maxRaces){
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: season, round: 1 } });       
      }
      this.setDefaultGPNavButtons(this.round);
      this.isCurrentRaceLoading=false;
      this.getData(this.season.toString(),this.round.toString());    
    });    
  }

  private getRaceResult(season:string, round:string){
    this.raceResultSubscription?.unsubscribe();
    this.isRaceResultLoading=true;
    this.raceResultSubscription=this.webService.getRaceResult(season,round).subscribe(res=>{
      this.raceResult=res;
      this.isRaceResultLoading=false;
    });
  }

  private getDriversStanding(season:string,round:string){
    this.driverStandingSubscription?.unsubscribe();
    this.driverStanding = [];
    this.isDriverStandingLoading = true;
    this.driverStandingSubscription=this.webService.getDriverStanding(season,round).subscribe(res => {
      this.isDriverStandingLoading = false;
      this.driverStanding = res;
    });
  }

  private getTeamStanding(season:string,round:string) {  
    this.teamStandingSubscription?.unsubscribe();
 
    this.isTeamStandingLoading = true;
    this.teamStandingSubscription=this.webService.getTeamStanding(season,round).subscribe(res => {
      this.isTeamStandingLoading = false;
      this.teamStanding = res;
    });
  }

  private getData(season:string,round:string){
    this.getDriversStanding(season,round);
    this.getTeamStanding(season,round);
    this.getRaceResult(season,round);
  }

  openDriverDetail(driverId:string){
    this.router.navigate(['driverdetail'], { queryParams: { id: driverId } });
  }

  ngOnDestroy(){
    this.circuitSubscripton?.unsubscribe();
    this.raceResultSubscription?.unsubscribe();
    this.driverStandingSubscription?.unsubscribe();
    this.teamStandingSubscription?.unsubscribe();
  }

}
