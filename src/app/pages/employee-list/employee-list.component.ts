import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { EmployeeDetailComponent } from '../employee-detail/employee-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { EmployeeAdminComponent } from '../employee-admin/employee-admin.component';
import { ConfirmationComponent } from 'app/confirmation/confirmation.component';



@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  dataEmployee: any = [];
  initDataEmployee;
  dataLength = 0;
  dataSource: any = [];
  paginatorSize = 10;
  page = 1;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initDataEmployee = JSON.parse(localStorage.getItem('dataDummy'));
    this.dataLength = this.initDataEmployee.length;
    this.dataSource = this.paginator(this.initDataEmployee, this.page, this.paginatorSize)
    this.dataEmployee = this.dataSource.data.filter(data => { if (!data.status) { return true } });
  }

  sortEmployee(sort: Sort){
    const data = this.dataEmployee.slice();
    if (!sort.active || sort.direction === '') {
      this.dataEmployee = data;
      return;
   }
   this.dataEmployee = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'name': return this.compare(a.first_name, b.first_name, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        case 'group': return this.compare(a.group, b.group, isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  paginator(items, current_page, per_page_items) {
    let page = current_page || 1,
      per_page = per_page_items || 10,
      offset = (page - 1) * per_page,

      paginatedItems = items.slice(offset).slice(0, per_page_items),
      total_pages = Math.ceil(items.length / per_page);

    return {
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: items.length,
      total_pages: total_pages,
      data: paginatedItems
    };
  }

  getNext(e: PageEvent) {
    this.page = e.pageIndex + 1;
    this.dataSource = this.paginator(this.initDataEmployee, this.page, this.paginatorSize)
    this.dataEmployee = this.dataSource.data.filter(data => { if (!data.status) { return true } });
  }

  detail(item) {
    const dialogRef = this.dialog.open(EmployeeDetailComponent, {
      width: '600px',
      height: '400px',
      data: {
        data: item,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result ", result);
    })
  }

  add() {
    const dialogRef = this.dialog.open(EmployeeAdminComponent, {
      width: '35vw',
      data: {
        origin: "Add",
        dataLen: this.dataLength,
        // data: item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initDataEmployee = JSON.parse(localStorage.getItem('dataDummy'));
        this.dataLength = this.initDataEmployee.length;
        this.dataSource = this.paginator(this.initDataEmployee, this.page, this.paginatorSize)
        this.dataEmployee = this.dataSource.data.filter(data => { if (!data.status) { return true } });
      }
    })
  }

  edit(item) {
    const dialogRef = this.dialog.open(EmployeeAdminComponent, {
      width: '35vw',
      data: {
        origin: "Edit",
        data: item,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initDataEmployee = JSON.parse(localStorage.getItem('dataDummy'));
        this.dataLength = this.initDataEmployee.length;
        this.dataSource = this.paginator(this.initDataEmployee, this.page, this.paginatorSize)
        this.dataEmployee = this.dataSource.data.filter(data => { if (!data.status) { return true } });
      }
    })
  }

  delete(item) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '25vw',
      data: {
        data: item,
        message: `Are you sure want to delete this <b>${item.first_name} ${item.last_name}</b> ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initDataEmployee.forEach((element, index) => {
          if (element.id == item.id) {
            element.status = true
            this.dataSource = this.paginator(this.initDataEmployee, this.page, this.paginatorSize);
            this.dataEmployee = this.dataSource.data.filter(data => { if (!data.status) { return true } });
            localStorage.setItem('dataDummy', JSON.stringify(this.initDataEmployee));
          }
        });
      }
    });
  }

}
