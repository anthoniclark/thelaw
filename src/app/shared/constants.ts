
import { DropDownModel } from "../models/dropDownModel";

export const httpResponseTypes = {
    BLOB: 'blob',
    JSON: 'json',
    TEXT: 'text',
    ARRAYBUFFER: 'arraybuffer'
};

export const httpObserves = {
    RESPONSE: 'response',
    EVENT: 'event',
    BODY: 'body'
};

export const ContactType = [
    { Id: "Client", Name: "Client" },
    { Id: "Advocate", Name: "Advocate" },
    { Id: "Contact", Name: "Contact" },
    { Id: "Witness", Name: "Witness" },
    { Id: "Opponent", Name: "Opponent" },
    { Id: "Associates", Name: "Associates" }
];



export const AddressType = {
    Home: 'Home',
    Office: 'Office'
};

export const contactDashboardTab = {
    0: 'NewlyAdded',
    1: 'Client',
    2: 'Advocate',
    3: 'LawFirm',
    4: 'Other'
};

export const CaseType = [
    { Id: "General", Name: "General" },
    { Id: "Litigation", Name: "Litigation" }
];

export const CasePriority = [
    { Id: "Low", Name: "Low" },
    { Id: "Normal", Name: "Normal" },
    { Id: "High", Name: "High" }
];

export const WorkedAs = [
    { Id: "Associate", Name: "Associate" },
    { Id: "Referral", Name: "Referral" },
    { Id: "Consultant", Name: "Consultant" },
    { Id: "FirstMeeting", Name: "First meeting" }
];

export const ExpenseCategory = [
    { Id: "Copying", Name: "Copying" },
    { Id: "Printing", Name: "Printing" },
    { Id: "Documentation", Name: "Documentation" },
    { Id: "Phone Call", Name: "Phone Call" },
    { Id: "Research", Name: "Research" },
    { Id: "Delivery", Name: "Delivery" },
    { Id: "Services", Name: "Services" },
    { Id: "Postage", Name: "Postage" },
    { Id: "Courier", Name: "Courier" },
    { Id: "Local Travel", Name: "Local Travel" },
    { Id: "Out of town travel", Name: "Out of town travel" },
    { Id: "Meals", Name: "Meals" },
    { Id: "Court Fees", Name: "Court Fees" },
    { Id: "Witness Summons Fees", Name: "Witness Summons Fees" },
    { Id: "Witness Fees", Name: "Witness Fees" },
    { Id: "Deposition Transcripts", Name: "Deposition Transcripts" },
    { Id: "Trial Transcripts", Name: "Trial Transcripts" },
    { Id: "Trial Exhibits", Name: "Trial Exhibits" },
    { Id: "Litigation Support Vendors", Name: "Litigation Support Vendors" },
    { Id: "Experts", Name: "Experts" },
    { Id: "Private Ivestigators", Name: "Private Ivestigators" },
    { Id: "Informer", Name: "Informer" },
    { Id: "Mediators", Name: "Mediators" },
    { Id: "Other Professionals", Name: "Other Professionals" },
    { Id: "Local Advisory", Name: "Local Advisory" },
    { Id: "Other", Name: "Other" }
];

export const DealOn = [
    { Id: "Crime", Name: "Crime" },
    { Id: "Civil", Name: "Civil" },
    { Id: "Family", Name: "Family" },
    { Id: "Forgery", Name: "Forgery" }
]

export const ContactTitle = [{
    Id: "Mr.", Name: "Mr."
},
{
    Id: "Ms.", Name: "Ms."
},
{
    Id: "Mrs.", Name: "Mrs."
},
{
    Id: "Dr.", Name: "Dr."
}
]

export const ComplainStatus = [{ Id: "Open", Name: "Open" }, { Id: "Close", Name: "Close" }];

export const NoImagePath: string = "../../assets/images/no-image.png"

export const CommunicationType = [
    { Id: "Phone Call", Name: "Phone Call" },
    { Id: "Email", Name: "Email" },
    { Id: "Fax", Name: "Fax" },
    { Id: "Message", Name: "Message" }
]

export const TaskCategory = [
    { Id: 1, Name: "Plan and prepare for Case" }, { Id: 2, Name: "Research" }, { Id: 3, Name: "Drafting" },
    { Id: 4, Name: 'Documentation' }, { Id: 5, Name: "Notice" }, { Id: 6, Name: "Review/analyze" },
    { Id: 7, Name: "meeting / Communicate inside the firm" }, { Id: 8, Name: "Meeting / Communicate with client" },
    { Id: 9, Name: "Meeting / Communicate with outside counsel" },
    { Id: 10, Name: "Meeting / Communicate with other external resources" },
    { Id: 11, Name: "Appear for Case" },
    { Id: 12, Name: "Manage data / files" },
    { Id: 13, Name: "Travel" }
]

export const Associates = [
    { Id: "1", Name: "Associate1" },
    { Id: "2", Name: "Associate2" },
    { Id: "3", Name: "Associate3" },
    { Id: "4", Name: "Associate4" }
]

export const DocumentCategory = [
    { Id: "Agreement", Name: "Agreement" },
    { Id: "Answer", Name: "Answer" },
    { Id: "Briefs", Name: "Briefs" },
    { Id: "Closing", Name: "Closing" },
    { Id: "Communication", Name: "Communication" },
    { Id: "Notice", Name: "Notice" }
]

export const BillingFrequencies = [
    { Id: "Hourly", Name: "Hourly" },
    { Id: "Monthly", Name: "Monthly" },
    { Id: "Quarterly", Name: "Quarterly" },
    { Id: "Yearly", Name: "Yearly" }
]