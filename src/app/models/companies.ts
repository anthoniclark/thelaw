export class Company {
    Id: number;
    CompanyName: string;
    InsdustrySection: string;
    Category: string;
    CompanySize: number;
    IsActive: boolean;
    UpdatedTime: string;
    Website: string;
    CompanyLogo: string;
    ContactIds: number[];
    DeletedContactIds: number[];
    Contacts: Contacts[];
}

export class Contacts {
    Name: string;
    ContactType: string;
    Id: number;
}