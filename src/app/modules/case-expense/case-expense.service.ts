import { Injectable } from '@angular/core';
import { HttpClientService } from 'app/lib/http/http-client.service';
import { CaseExpense } from '../../models/case-expense';
import { Page, Sorting } from 'app/models/page';
import { environment } from 'environments/environment';

@Injectable()
export class CaseExpenseService {

  constructor(private httpService: HttpClientService) { }

  getCaseExpenseCategories() {
    return this.httpService.get('ExpenseType/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    })
  }

  getCaseExpenseById(id: number) {
    return this.httpService.get('CaseExpense/GetCaseExpenseById/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getCaseExpenses() {
    return this.httpService.get('CaseExpense/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    })
  }

  addOrUpdate(caseExpenseModel: CaseExpense) {
    let url = ''
    if (caseExpenseModel.Id) {
      url = 'CaseExpense/update';
      return this.httpService.put(url, caseExpenseModel).map((res: any) => {
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
      url = 'CaseExpense/create';
      return this.httpService.post(url, caseExpenseModel).map((res: any) => {
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

  deleteCaseExpense(id: number) {
    return this.httpService.delete('CaseExpense/delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  uploadFileWithData(id: number, caseId: number, formData: FormData) {
    return this.httpService.postFormData(`CaseExpense/UploadBillDocument/${id}?caseId=${caseId}`, formData).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getBillDocument(id: number) {
    return this.httpService.get(`CaseExpense/GetBillDocument/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });

  }

  getCaseExpensesPageData(page: Page, sort: Sorting, filterColumn?: string, filterValue?: string) {
    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    return this.httpService.get(`CaseExpense/GetAllFilter?page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  downloadDocument(id) {
    window.open(`${environment.origin}CaseExpense/GetBillDocument/${id}`, '_blank');
  }

  deleteDocument(id) {
    return this.httpService.delete(`CaseExpense/Delete/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }
}
