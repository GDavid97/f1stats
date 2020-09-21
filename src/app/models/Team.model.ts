export class Team {
    constructorId: string;
    url?: string;
    name: string;
    nationality?: string;
    photo: string;
}
export class DrivenInTeam extends Team {
    startSeason: number;
    endSeason: number;
}
