import { Component, OnInit } from '@angular/core';
import { PlatesService } from './plates.service';
import { EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Plate } from './Plate';
import { analyzeAndValidateNgModules } from '@angular/compiler';

enum Status {
  new,
  done,
  error
}

@Component({
  selector: 'app-plates',
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss']
})
export class PlatesComponent implements OnInit {
  Status = Status;

  plates: any;
  plate: Plate = {
    id: null,
    owner: '',
    number: ''
  };
  plateToDelete: Plate = {
    id: null,
    owner: '',
    number: ''
  }

  pages = [];
  currentPage = null;

  deleteEmitter = new EventEmitter();
  deleteStatus = Status.new;
  updateStatus = Status.new;
  updateError: string;
  searchText: any = '';
  inSearch = false;

  constructor(private modalService: NgbModal, private platesService: PlatesService) { }

  ngOnInit(): void {
    this.platesService.getCount().subscribe((count: number) => {
      let start = 1;

      this.pages.push({
        start,
        title: `Plates ${start}-${start+9}`
      });

      start = 11;
      while(count > 10) {
        this.pages.push({
          start,
          title: `Plates ${start}-${start+9}`
        });

        count -= 10;
        start += 10;
      }
    });

    this.platesService.get().subscribe(plates => this.plates = plates);
  }

  delete(id) {
    this.deleteEmitter.emit({
      id
    });
  }

  openDeleteModal(content, plate) {
    this.plateToDelete = {
      id: plate._id,
      owner: plate.owner,
      number: plate.plateNumber
    };

    this.modalService.open(content, {ariaLabelledBy: 'modal-new-plate'}).result.then((result) => {
      if (result == "save") {
        this.platesService.delete(this.plateToDelete.id)
        .subscribe(data => {
          this.deleteStatus = Status.done;
        }, (err) => {
          console.log(err);
          this.deleteStatus= Status.error;
        });
        this.openDeleteModal(content, plate);
      }
    }, (reason) => {
      if (reason == "close") {
        window.location.href = "/";
      }
    });
  }

  openUpdateModal(content, plate) {
    this.plate.number = plate.plateNumber;
    this.plate.owner = plate.owner;

    this.modalService.open(content, {ariaLabelledBy: 'modal-update-plate'}).result.then((result) => {
      if (result == "save") {
        if (!this.plate.number || !this.plate.owner) {
          this.updateError = 'All fields are required!';
          this.openUpdateModal(content, plate);
          return;
        }
        const pattern = /[a-zA-Z]{3}[\d]{3}/;
        const matches = this.plate.number.match(pattern);
        if (!matches || matches[0] != this.plate.number) {
          this.updateError = 'Please enter correct plate number. Pattern is XXXYYY, where X must be a letter and Y must be a digit!';
          this.openUpdateModal(content, plate);
          return;
        }

        this.platesService.update({
          id: plate._id,
          owner: this.plate.owner,
          plateNumber: this.plate.number
        }).subscribe(data => {
          if (data != "PLATE_EXISTS") {
            this.updateStatus = Status.done;
          } else {
            this.updateError = 'A plate with same number already exists!';
          }
        }, (err) => {
          this.updateStatus= Status.error;
        });
        this.openUpdateModal(content, plate);
      }
    }, (reason) => {
      this.modalService.dismissAll();
    });
  }

  closeUpdateModal(reload = false) {
    this.plate = {
      id: null,
      owner: '',
      number: ''
    };

    this.updateStatus = Status.new;
    this.updateError = '';

    if (reload) {
      window.location.href = '/';
    }
  }


  changePage() {
    const page = this.pages.find(p => p.title == this.currentPage) || this.pages[0];
    if (page) {
      this.platesService.get(page.start).subscribe(plates => this.plates = plates);
    }
  }


  search() {
    if (!!this.searchText) {
      this.platesService.search(this.searchText).subscribe(plates => this.plates = plates);
      this.inSearch = true;
    }
  }


  closeSearch() {
    this.searchText = '';
    this.inSearch = false;
    this.changePage();
  }
}
