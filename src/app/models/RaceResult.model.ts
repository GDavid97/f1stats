import { Driver } from './Driver.model';

export class RaceResult {
    raceName: string;
    round: string;
    date: string;
    season: string;
    circuit: string;
    drivers: DriverResult[];
}

export class DriverResult extends Driver {
    grid: string;
    laps: string;
    points: string;
    position: string;
    positionText: string;
    status: string;
    fastestLap:boolean;
}