import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'employee-admin',
  templateUrl: './employee-admin.component.html',
  styleUrls: ['./employee-admin.component.css']
})
export class EmployeeAdminComponent implements OnInit {
  employeeForm: FormGroup;
  maxDate = new Date();
  searchCtrl = new FormControl();
  groupList;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<EmployeeAdminComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const intRegex = /^\d+$/;

 this.employeeForm = this.fb.group({
      username: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(emailRegex)])),
      gender: new FormControl('', Validators.required),
      group: new FormControl('', Validators.required),
      basicSalary: new FormControl('', Validators.compose([Validators.required, Validators.pattern(intRegex)])),
      description: new FormControl('', Validators.required),
    })

    if (this.data.origin === 'Edit') {
      this.employeeForm.patchValue(this.data.data);
      this.employeeForm.controls.birthdate.setValue(new Date(this.data.data.birthdate));
    }

    this.groupList = JSON.parse(localStorage.getItem('dataGroupList'));
     this.searchCtrl.valueChanges.subscribe(res => {
      const masterDataGroup = JSON.parse(localStorage.getItem('dataGroupList'));
      if (res) {
        this.groupList = masterDataGroup.filter(data => {
          return data.title.toLowerCase().includes(res.toLowerCase())
        })
      }
    })
  }

  onSubmit() {
    console.log("employee form", this.employeeForm.value);
  }
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    // GET DATA
    let employeeList = JSON.parse(localStorage.getItem('dataDummy'));

    if (this.data.origin === 'Add') {
      const body = {
        id: this.data.dataLen + 1,
        username: this.employeeForm.value.username,
        first_name: this.employeeForm.value.first_name,
        last_name: this.employeeForm.value.last_name,
        birthdate: this.employeeForm.value.birthdate,
        email: this.employeeForm.value.email,
        gender: this.employeeForm.value.gender,
        group: this.employeeForm.value.group,
        basicSalary: this.employeeForm.value.basicSalary,
        description: this.employeeForm.value.description,
        status: false,
      }

      employeeList.push(body);


    }
    else if (this.data.origin === 'Edit') {
      // UPDATE DATA
      employeeList.map(item => {
        if (item.id === this.data.data.id) {
          item.first_name = this.employeeForm.value.first_name;
          item.last_name = this.employeeForm.value.last_name;
          item.birthdate = this.employeeForm.value.birthdate;
          item.email = this.employeeForm.value.email;
          item.gender = this.employeeForm.value.gender;
          item.group = this.employeeForm.value.group;
          item.basicSalary = this.employeeForm.value.basicSalary;
          item.description = this.employeeForm.value.description;
        }
      });

    }

    localStorage.setItem('dataDummy', JSON.stringify(employeeList));
    this.dialogRef.close('success');
  }




}
