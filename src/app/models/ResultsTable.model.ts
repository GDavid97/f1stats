export class ResultsTableRow {
  name: string;
  team: string;
  points: number;
  position?: number;
  results: ResultsTableColumn[] = [];
}

export class ResultsTableColumn {
  points: number;
  position: string;
  raceName: string;
  round: string;
}
