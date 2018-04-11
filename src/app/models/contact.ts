export class Contact {
    Id: number;
    Title: string;
    FirstName: string;
    LastName: string;
    ContactType: string;
    CompanyId: number;
    IsImportant: boolean;
    Reference: string;
    DealOn: string;
    PriceRate: number;
    BasePrice: number;
    IsActive: boolean;
    UpdatedTime: Date;
    Address: Address[];
    MobileNumbers: Mobile[];
    EmailAddress: Email[];
    Designation: string;
}

export class Address {
    Id: number;
    Address1: string;
    CountryId: number;
    State: number;
    CityId: number;
    PostCode: string;
    AddressType: string;
    IsPrimary: boolean;
}

export class Mobile {
    Id: number;
    MobileNumber: string;
    IsPrimary: boolean;
    MobileType: string;
    ContactId: number;
}

export class Email {
    Id: number;
    EmailId: string;
    IsPrimary: boolean;
    ContactId: number;
}