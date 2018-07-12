import { Injectable } from '@angular/core';
import { HttpClientService } from 'app/lib/http/http-client.service';
import { Case, CaseStatus, CaseCommunication, TimeTracking, CaseNote, Document, AppealType, CaseEvidence, Judge, ContactQuickAdd, TaskCategory, Stage } from 'app/models/case';
import { Page, Sorting } from 'app/models/page';
import { environment } from 'environments/environment';
import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class CaseService {

  constructor(private httpService: HttpClientService,private authService: AuthService) { }

  getCaseById(id: number) {
    return this.httpService.get('case/GetCaseById/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getCases() {
    return this.httpService.get('case/getall').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    })
  }
  searchCase(term: string) {
    return this.httpService.get(`case/GetCases?search=${term}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addOrUpdate(caseModel: Case) {
    let url = ''
    if (caseModel.Id) {
      url = 'case/update';
      return this.httpService.put(url, caseModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    } else {
      url = 'case/create';
      return this.httpService.post(url, caseModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    }
  }

  deleteCase(id: number) {
    return this.httpService.delete('case/delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCourtsDD() {
    return this.httpService.get('Court/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    })
  }

  getJudgesDD() {
    return this.httpService.get('Judge/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCaseAppealTypes() {
    return this.httpService.get('AppealType/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCaseStatusList() {
    return this.httpService.get('Case/GetCaseStatus').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }


  getStages() {
    return this.httpService.get('Stage/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addOrUpdateStatus(statusModel: CaseStatus) {
    let url = ''
    if (statusModel.Id) {
      url = 'CaseStatus/update';
      return this.httpService.put(url, statusModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    } else {
      url = 'CaseStatus/create';
      return this.httpService.post(url, statusModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    }
  }

  getCommunicationById(id: number) {
    return this.httpService.get('CaseCommunication/GetCaseCommunicationById/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getCommunicationByCaseId(caseId: number) {
    return this.httpService.get('CaseCommunication/GetCaseCommunicationByCaseId?caseid=' + caseId).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  addOrUpdateCommunication(communicationModel: CaseCommunication) {
    let url = ''
    if (communicationModel.Id) {
      url = 'CaseCommunication/update';
      return this.httpService.put(url, communicationModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    } else {
      url = 'CaseCommunication/Create';
      return this.httpService.post(url, communicationModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    }
  }

  deleteCommunication(id: number) {
    return this.httpService.delete('CaseCommunication/Delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addOrUpdateTimeTracker(model: TimeTracking) {
    let url = ''
    if (model.Id) {
      url = 'TaskTimeTracker/update';
      return this.httpService.put(url, model).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    } else {
      url = 'TaskTimeTracker/Create';
      return this.httpService.post(url, model).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    }
  }

  getTaskTrackerById(id: number) {
    return this.httpService.get('TaskTimeTracker/GetTaskTimeTrackerById/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getTimeTrackingByCaseId(caseId: number) {
    return this.httpService.get(`TaskTimeTracker/GetTaskTimeTrackerByCaseId?caseid=${caseId}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  searchAssociateName(term: string) {
    return this.httpService.get(`Contact/GetAssociates?search=${term}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  deleteTaskTimeTracking(id: number) {
    return this.httpService.delete('TaskTimeTracker/Delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getNoteById(id: number) {
    return this.httpService.get('notes/GetNotesById/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getNoteByCaseId(caseId: number) {
    return this.httpService.get('notes/GetNotesByCaseId?caseid=' + caseId).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  addOrUpdateNote(noteModel: CaseNote) {
    let url = ''
    if (noteModel.Id) {
      url = 'notes/update';
      return this.httpService.put(url, noteModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    } else {
      url = 'notes/Create';
      return this.httpService.post(url, noteModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    }
  }

  deleteNote(id: number) {
    return this.httpService.delete('notes/Delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  uploadCaseDocument(id: number, caseId: number, formData: FormData) {
    return this.httpService.postFormData(`Document/UploadDocument/${id}?caseId=${caseId}`, formData).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCaseDocument(id: number) {
    return `${environment.origin}Document/downloaddocument/${id}`;
  }

  deleteCaseDocument(id: number) {
    return this.httpService.delete('Document/Delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  deleteCaseDocumentFile(id: number) {
    return this.httpService.delete('Document/DeleteDocumentFile/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addOrUpdateCaseDocument(documentModel: Document) {
    let url = ''
    if (documentModel.Id) {
      url = 'document/update';
      return this.httpService.put(url, documentModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    } else {
      url = 'document/create';
      return this.httpService.post(url, documentModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    }
  }

  getCaseDocumentById(id: number) {
    return this.httpService.get('Document/GetDocumentById/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getCaseDocumentsByCaseId(caseId: number, page: Page, sort: Sorting, filterColumn?: string, filterValue?: string) {
    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    return this.httpService.get(`Document/GetAllFilter?caseId=${caseId}&page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCasePageData(contactId: string, page: Page, sort: Sorting, filterColumn?: string, filterValue?: string) {
    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    const link = (contactId ? ("contactId=" + contactId) + '&' : '') + `page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`;
    return this.httpService.get(`Case/GetAllFilter?${link}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addAppealType(model: AppealType) {
    return this.httpService.post(`AppealType/Create`, model).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addTaskCategory(model: TaskCategory) {
    return this.httpService.post(`TaskCategory/Create`, model).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addStage(model: Stage) {
    return this.httpService.post(`Stage/Create`, model).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCaseEvidencePageData(caseId: number, page: Page, sort: Sorting, filterColumn?: string, filterValue?: string) {
    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    return this.httpService.get(`CaseEvidence/GetAllFilter?caseId=${caseId}&page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  deleteCaseEvidence(id) {
    return this.httpService.delete(`CaseEvidence/Delete/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCaseEvidenceById(id) {
    return this.httpService.get(`CaseEvidence/GetCaseEvidenceById/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addOrUpdateCaseEvidence(caseEvidenceModel: CaseEvidence, caseId: number) {
    let url = '';
    const model = {
      EvidenceName: caseEvidenceModel.EvidenceName,
      CaseId: caseId,
      Tags: caseEvidenceModel.Tags,
      Id: caseEvidenceModel.Id ? caseEvidenceModel.Id : null,
      IsActive: true
    };
    if (!model.Id) {
      delete model.Id;
    }
    if (caseEvidenceModel.Id) {
      url = 'CaseEvidence/update';
      return this.httpService.put(url, model).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        throw 'We are facing some issue with server, Plesae try after some time.';
      }).catch((err: any) => {
        throw err;
      });
    } else {
      url = 'CaseEvidence/create';
      return this.httpService.post(url, model).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        throw 'We are facing some issue with server, Plesae try after some time.';
      }).catch((err: any) => {
        throw err;
      });
    }
  }

  uploadCaseEvidenceFile(id: number, caseId: number, formData: FormData) {
    return this.httpService.postFormData(`CaseEvidence/UploadEvidence/${id}?caseId=${caseId}`, formData).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }
  downloadCaseEvidenceFile(id) {
    window.open(`${environment.origin}CaseEvidence/DownloadEvidenceFile/${id}`, '_blank');
  }

  downloadDocument(id) {
    window.open(`${environment.origin}Document/DownloadDocument/${id}`, '_blank');
  }

  deleteCaseEvidenceFile(id) {
    return this.httpService.get(`CaseEvidence/DeleteEvidenceFile/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });

  }

  getNotesByCaseIdPageData(caseId: number, page: Page, sort: Sorting, filterColumn?: string, filterValue?: string) {
    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    return this.httpService.get(`Notes/GetAllFilter?caseId=${caseId}&page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addJudge(judgeModel: Judge) {
    return this.httpService.post(`Judge/Create`, judgeModel).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getTimeTrackerPageDate(caseId: number, page: Page, sort: Sorting, filterColumn?: string, filterValue?: string) {
    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    return this.httpService.get(`TaskTimeTracker/GetAllFilter?caseId=${caseId}&page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getAllTaskCategories() {
    return this.httpService.get(`TaskCategory/GetAll`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  caseFullTextSearch(text: string, contactId: string, page: Page, sort: Sorting) {
    const link = (contactId ? ("contactId=" + contactId) + '&' : '') + `page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}
    &searchValue=${text}`;
    return this.httpService.get(`Case/GetFullTextSearch?${link}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }
  deleteDocumentFile(id) {
    return this.httpService.get('Document/DeleteDocumentFile/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  createQuickContact(contactQuickAddModel: ContactQuickAdd) {
    return this.httpService.post(`Contact/CreateQuick`, contactQuickAddModel).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getAllAssociates() {
    return this.httpService.get(`Contact/GetContactByType?type=associates`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCities(stateId: number) {
    return this.httpService.get('City/GetCityStateById/' + stateId).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getAllCities() {
    return this.httpService.get('City/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getAllStates() {
    return this.httpService.get('state/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  saveCourt(model) {
    return this.httpService.post('Court/Create', model).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  markCaseAsImportant(id, tenant) {
    const model = { id, Tenant: tenant };
    return this.httpService.post(`Case/MarkImportantCase/${id}`, model).map((res: any) => {
      if (res) {
        return res;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  exportCase() {
    window.open(`${environment.origin}${this.authService.getTenent()}/Case/ExportCase`, '_blank');
    //window.open(`${environment.origin}Case/ExportCase`, '_blank');
  }


  getCaseHistory(caseId: string, page: Page, sort: Sorting, filterColumn?: string, filterValue?: string) {
    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    const link = ('caseId=' + caseId)
      + '&' + `page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`;
    return this.httpService.post(`CaseStatus/History?${link}`, {}).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }
}

