import { CandidatesService } from './../../_services/candidates.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Candidate } from 'src/app/model/candidate';
// Imports for the table
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-candidates',
  templateUrl: './list-candidates.component.html',
  styleUrls: ['./list-candidates.component.css']
})
export class ListCandidatesComponent implements OnInit {
  
  candidates: any[] = [];

  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'skills', 'studies', 'location', 'experience', 'state'];
  dataSource: MatTableDataSource<Candidate>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private candidatesService:CandidatesService) {
    this.dataSource = new MatTableDataSource(this.getAllCandidates());
  }

  // Material table
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getCandidates();
    this.getAllCandidates();
    console.log(this.dataSource.data)
    console.log(this.candidates);
  }

  public getCandidates():void {
    this.candidatesService.getCandidates().subscribe({
      next: (response: Object[]) => {
        this.candidates = response;
        console.log(this.candidates);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
  }

  public getAllCandidates():Candidate[] {
    let data: Candidate[] = [];
    this.candidatesService.getAllCandidates().subscribe({
      next: (response: Candidate[]) => {
        console.log(response);
        data = response;
        // Initialize datasource with response from backend
        this.dataSource.data = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
    return data;
  }
}