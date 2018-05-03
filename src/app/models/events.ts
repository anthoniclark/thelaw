export class Events {
    Id: number;
    EventTypeId: number;
    EventTitle: string;
    EventDescription: string;
    CaseId: number;
    FromDateTime: string;
    ToDateTime: string;
    Frquency: string;
}

export class EventTypes {
    Id: number;
    TypeName: string;
    Color: string;
}