import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  ResultsTableRow,
  ResultsTableColumn,
} from "src/app/models/ResultsTable.model";
import { SeasonRound } from "src/app/models/SeasonRound.model";

@Component({
  selector: "career-table",
  templateUrl: "./career-table.component.html",
  styleUrls: ["./career-table.component.scss"],
})
export class CareerTableComponent implements OnInit, OnChanges {
  @Input()
  data: ResultsTableRow[];

  @Input()
  firstRowHeader: string;

  @Output()
  onOpenRaceDetails: EventEmitter<SeasonRound> = new EventEmitter<SeasonRound>();

  @Output()
  onRowTitleClick: EventEmitter<string> = new EventEmitter<string>();

  maxCols = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue?.length > 0) {
      this.data.forEach((e) => {
        if (e.results.length > this.maxCols) {
          this.maxCols = e.results.length;
        }
      });
    }
  }

  getColumnData(row: ResultsTableRow): ResultsTableRow {
    const result = Object.assign({}, row);
    result.results = [];
    let j = 0;
    // for (let i = 0; i < this.maxCols; i++) {
    //   if (row.results[j] && j + 1 === parseInt(row.results[j].round)) {
    //     result.results.push(row.results[j]);
    //     j++;
    //   } else {
    //     result.results.push({
    //       points: null,
    //       position: "",
    //       raceName: "",
    //       round: (i + 1).toString(),
    //     });
    //     j++;
    //   }
    // }

    for (let i = 0; i < this.maxCols; i++) {
      if (
        row.results[i] &&
        (parseInt(row.results[i].round) === i + 1 ||
          (result.results.length > 0 &&
            parseInt(row.results[i].round) - 1 ==
              parseInt(result.results[result.results.length - 1].round)))
      ) {
        result.results.push(row.results[i]);
      } else if (row.results[i]) {
        let t = result.results[result.results.length - 1]
          ? parseInt(result.results[result.results.length - 1].round)
          : i;
        let diff = parseInt(row.results[i].round) - t - 1;
        for (let j = 0; j < diff; j++) {
          result.results.push({
            points: null,
            position: "",
            raceName: "",
            round: (i + j + 1).toString(),
          });
        }
        result.results.push(row.results[i]);
      }
    }

    let diff = this.maxCols - result.results.length;
    for (let j = 0; j < diff; j++) {
      result.results.push({
        points: null,
        position: "",
        raceName: "",
        round: (this.maxCols - 1 - diff + j).toString(),
      });
    }

    return result;
  }

  getTooltipText(row: ResultsTableRow, column: ResultsTableColumn): string {
    const result = `${this.firstRowHeader} ${row.name}: ${column.raceName} `;

    return result;
  }

  openRaceDetails(season: string, round: string) {
    this.onOpenRaceDetails.emit({ season, round });
  }

  rowTitleClick(season: string) {
    this.onRowTitleClick.emit(season);
  }
}
