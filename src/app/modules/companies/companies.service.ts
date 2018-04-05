import { Injectable } from '@angular/core';
import { HttpClientService } from '../../lib/http/http-client.service';
import { Page, Sorting } from '../../models/page';
import { Company } from '../../models/companies';

@Injectable()
export class CompaniesService {

  constructor(private httpClientService: HttpClientService) {
  }
  companiesPageData(page: Page, sort: Sorting, filterColumn?: string, filterValue?: string) {
    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    return this.httpClientService.get(`Companies/GetAllFilter?page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCompanyById(id) {
    return this.httpClientService.get(`Companies/GetCompaniesById/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }, error => {
      throw error;
    });
  }

  deleteCompany(id) {
    return this.httpClientService.delete(`Companies/Delete/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }, error => {
      throw error;
    });
  }

  getAllContacts() {
    return this.httpClientService.get(`Contact/GetAll`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }, error => {
      throw error;
    });
  }

  addOrUpdateCompany(model: Company) {
    let url = ''
    if (model.Id) {
      url = 'Companies/Update';
      return this.httpClientService.put(url, model).map((res: any) => {
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
      url = 'Companies/create';
      return this.httpClientService.post(url, model).map((res: any) => {
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

  uploadFileWithData(id: number, formData: FormData) {
    return this.httpClientService.postFormData(`Companies/UploadLogo/${id}`, formData).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCompanyLogo(id: number) {
    return this.httpClientService.get(`Companies/GetLogo/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  deleteCompanyLogo(id) {
    return this.httpClientService.get(`Companies/DeleteLogo/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });

  }

}
