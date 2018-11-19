import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-historic-media',
  templateUrl: './historic-media.component.html',
  styleUrls: ['./historic-media.component.css']
})
export class HistoricMediaComponent implements OnInit {

  @Input() listHistoric: Array<any>;
  constructor() { }

  ngOnInit() {
  }

}
