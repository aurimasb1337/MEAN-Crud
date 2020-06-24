import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatesService } from '../plates.service';
import { Plate } from '../Plate';

enum Status {
  new,
  done,
  error
}

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  plate: Plate = {
    owner: '',
    number: ''
  };
  Status = Status;
  status = Status.new;
  error = '';

  constructor(private modalService: NgbModal, private platesService: PlatesService) { }

  ngOnInit(): void {
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-new-plate'}).result.then((result) => {
      if (result == "save") {
        if (!this.plate.number || !this.plate.owner) {
          this.error = 'All fields are required!';
          this.open(content);
          return;
        }
        const pattern = /[a-zA-Z]{3}[\d]{3}/;
        const matches = this.plate.number.match(pattern);
        if (!matches || matches[0] != this.plate.number) {
          this.error = 'Please enter correct plate number. Pattern is XXXYYY, where X must be a letter and Y must be a digit!';
          this.open(content);
          return;
        }

        this.platesService.create({
          owner: this.plate.owner,
          plateNumber: this.plate.number
        }).subscribe(data => {
          if (data != "PLATE_EXISTS") {
            this.status = Status.done;
          } else {
            this.error = 'A plate with same number already exists!';
          }
        }, (err) => {
          this.status = Status.error;
        });
        this.open(content);
      }
    }, (reason) => {
      this.modalService.dismissAll();
    });
  }

  close(reload = false) {
    this.plate = {
      owner: '',
      number: ''
    };

    this.status = Status.new;
    this.error = '';

    if (reload) {
      window.location.href = '/';
    }
  }
}
