import { Component, OnInit } from "@angular/core";
import { WebService } from "src/app/services/web/web.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LineChartData } from "src/app/models/LineChartData.model";
import { Subscription } from "rxjs";
import { RaceEvent } from "src/app/models/RaceEvent.model";
import { Standing } from "src/app/models/Standing.model";
import {
  ResultsTableColumn,
  ResultsTableRow,
} from "src/app/models/ResultsTable.model";

@Component({
  selector: "app-season-page",
  templateUrl: "./season-page.component.html",
  styleUrls: ["./season-page.component.scss"],
})
export class SeasonPageComponent implements OnInit {
  driversPointsForChart: LineChartData[];
  circuits: RaceEvent[];
  driverStanding: Standing[];
  teamStanding: Standing[];
  resultTableData: ResultsTableRow[] = [];

  season: number = new Date().getFullYear();
  nextButtonDisabled = true;
  prevButtonDisabled = true;

  driverResultsSubscription: Subscription;
  circuitSubscription: Subscription;
  driverStandingSubscription: Subscription;
  teamStandingSubscription: Subscription;
  raceResultSubscription: Subscription;

  isDriverPointsLoading = true;
  isCircuitsLoading = true;
  isDriverStandingLoading = true;
  isTeamStandingLoading = true;
  isResultTableLoading = true;

  constructor(
    private webService: WebService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params.season) {
        if (
          params.season >= 1950 &&
          params.season <= new Date().getFullYear()
        ) {
          this.season = params.season;
          this.setDefaultNavButtons(this.season);
          this.getData(this.season.toString());
        } else {
          this.router.navigate(["."], {
            relativeTo: this.route,
            queryParams: { season: new Date().getFullYear() },
          });
        }
      } else {
        this.router.navigate(["."], {
          relativeTo: this.route,
          queryParams: { season: this.season },
        });
      }
    });
  }

  ngOnInit() {
    this.setDefaultNavButtons(this.season);
    this.getData(this.season.toString());
  }

  setDefaultNavButtons(season: number) {
    if (season == new Date().getFullYear()) {
      this.prevButtonDisabled = false;
      this.nextButtonDisabled = true;
    } else if (season == 1950) {
      this.prevButtonDisabled = true;
      this.nextButtonDisabled = false;
    } else {
      this.prevButtonDisabled = false;
      this.nextButtonDisabled = false;
    }
  }

  prevSeason() {
    if (this.season > 1950) {
      this.season--;

      this.nextButtonDisabled = false;
      this.prevButtonDisabled = false;
      if (this.season == 1950) {
        this.prevButtonDisabled = true;
      } else {
        this.nextButtonDisabled = false;
        this.prevButtonDisabled = false;
      }
    }

    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: { season: this.season },
    });
    this.getData(this.season.toString());
  }

  nextSeason() {
    const currentYear = new Date().getFullYear();
    if (this.season < currentYear) {
      this.season++;

      if (this.season == currentYear) {
        this.nextButtonDisabled = true;
      } else {
        this.nextButtonDisabled = false;
        this.prevButtonDisabled = false;
      }
    }
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: { season: this.season },
    });
    this.getData(this.season.toString());
  }

  private getDriverResults(season: string) {
    this.driverResultsSubscription?.unsubscribe();
    const pointResult: LineChartData[] = [];
    this.isDriverPointsLoading = true;
    this.driverResultsSubscription = this.webService
      .getDriverResults(season)
      .subscribe((res) => {
        // fill all drivers who participated in the season
        for (const race of res) {
          for (const result of race.Results) {
            const lineChartData = pointResult.find(
              (e) => e.id == result.Driver.driverId
            );
            if (!lineChartData) {
              pointResult.push({
                id: result.Driver.driverId,
                text: `${result.Driver.givenName} ${result.Driver.familyName}`,
                values: new Map<string, number>(),
              });
            }
          }
        }
        for (const race of res) {
          for (const driver of pointResult) {
            const result = race.Results.find(
              (element) => element.Driver.driverId == driver.id
            );
            if (result) {
              const points: number = parseInt(result.points);
              const getLastValueInMap = (map) => [...map][map.size - 1][1];
              if (driver.values.size > 0) {
                const newPoints: number =
                  points + getLastValueInMap(driver.values);
                driver.values.set(race.raceName, newPoints);
              } else {
                driver.values.set(race.raceName, parseInt(result.points));
              }
            } else {
              const points = 0;
              const getLastValueInMap = (map) => [...map][map.size - 1][1];
              if (driver.values.size > 0) {
                const newPoints: number =
                  points + getLastValueInMap(driver.values);
                driver.values.set(race.raceName, newPoints);
              } else {
                driver.values.set(race.raceName, 0);
              }
            }
          }
        }

        this.driversPointsForChart = pointResult;
        this.isDriverPointsLoading = false;
      });
  }

  private getCircuits(season: string) {
    this.circuitSubscription?.unsubscribe();
    this.circuits = [];
    this.isCircuitsLoading = true;
    this.circuitSubscription = this.webService
      .getCircuits(season)
      .subscribe((res) => {
        this.isCircuitsLoading = false;
        this.circuits = res;
      });
  }

  private getRaceResults(season: string) {
    this.raceResultSubscription?.unsubscribe();
    this.resultTableData = [];
    this.isResultTableLoading = true;
    this.raceResultSubscription = this.webService
      .getSeasonResults(season)
      .subscribe((res) => {
        this.isResultTableLoading = false;
        const races = res.MRData.RaceTable.Races;
        races.forEach((race) => {
          race.Results.forEach((result) => {
            const driverName = `${result.Driver.givenName} ${result.Driver.familyName}`;
            const currentRow = this.resultTableData.find(
              (driver) => driver.name === driverName
            );
            if (!currentRow) {
              const row: ResultsTableRow = new ResultsTableRow();
              row.name = driverName;
              row.team = result.Constructor.name;
              row.points = parseInt(result.points);
              row.results = [
                {
                  points: result.points,
                  position: result.position,
                  round: race.round,
                  raceName: race.raceName,
                },
              ];
              this.resultTableData.push(row);
            } else {
              currentRow.results.push({
                points: result.points,
                position: result.position,
                round: race.round,
                raceName: race.raceName,
              });
              currentRow.points =
                Number(currentRow.points) + parseInt(result.points);
            }
          });
        });
        this.resultTableData.sort((a, b) => {
          return b.points - a.points;
        });
      });
  }

  private getDriversStanding(season: string) {
    this.driverStandingSubscription?.unsubscribe();
    this.driverStanding = [];
    this.isDriverStandingLoading = true;
    this.driverStandingSubscription = this.webService
      .getDriverStanding(season)
      .subscribe((res) => {
        this.isDriverStandingLoading = false;
        this.driverStanding = res;
      });
  }

  private getTeamStanding(season: string) {
    this.teamStandingSubscription?.unsubscribe();

    this.isTeamStandingLoading = true;
    this.teamStandingSubscription = this.webService
      .getTeamStanding(season)
      .subscribe((res) => {
        this.isTeamStandingLoading = false;
        this.teamStanding = res;
      });
  }

  private getData(season: string) {
    this.getDriverResults(season);
    this.getCircuits(season);
    this.getDriversStanding(season);
    this.getTeamStanding(season);
    this.getRaceResults(season);
  }

  openGPDetails(round: number) {
    this.router.navigate(["gp"], {
      queryParams: { season: this.season, round },
    });
  }
  openDriver(driver: string) {
    const driverId = this.driverStanding.find((e) => e.name === driver).id;
    this.router.navigate(["driverdetail"], {
      queryParams: { id: driverId },
    });
  }

  ngOnDestroy() {
    this.driverResultsSubscription?.unsubscribe();
    this.circuitSubscription?.unsubscribe();
    this.driverStandingSubscription?.unsubscribe();
    this.teamStandingSubscription?.unsubscribe();
    this.raceResultSubscription?.unsubscribe();
  }
}
