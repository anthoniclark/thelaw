import { Address, Mobile, Email } from "./contact";

export class Company {
    Id: number;
    CompanyName: string;
    InsdustrySection: string;
    CINNumber: string;
    Category: string;
    CompanySize: number;
    IsActive: boolean;
    UpdatedTime: string;
    Website: string;
    CompanyLogo: string;
    ContactIds: number[];
    DeletedContactIds: number[] = [];
    Contacts: Contacts[];
    Address: Address[] = [];
    MobileNumbers: Mobile[] = [];
    EmailAddress: Email[] = [];
}

export class Contacts {
    Name: string;
    ContactType: string;
    Id: number;
}