import { Component, inject, OnInit } from '@angular/core';
import { SignalConfigService } from '../../services/signal-config.service';
import { SignalStatus } from '../../interfaces/signal-config.interface';
import { CommonModule, NgIf, NgClass } from "@angular/common";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManualOverride } from './manual-override/manual-override';
import { HighchartsChartComponent } from 'highcharts-angular';
import { TabDirective, TabsetComponent } from "ngx-bootstrap/tabs";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HighchartsChartComponent, TabsetComponent, TabDirective, NgIf, FormsModule, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  auth = inject(AuthService);
  signalStatus: SignalStatus[] = [];
  modalRef?: BsModalRef;
  region: string = 'Karnataka';
  regions: string[] = ['Karnataka'];
  showTrafficData: boolean = false;
  errorLoadingTrafficData: boolean = false;
  alertMessage: string = '';
  // Highcharts configurations
  public totalVehiclesChartOptions!: Highcharts.Options;
  public vehicleTypeBreakdownChartOptions!: Highcharts.Options;
  public congestionPieChartOptions!: Highcharts.Options;

  constructor(private readonly signalService: SignalConfigService,
    private readonly modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getSignalStatus();
  }

  loadTrafficData() {
    this.signalService.loadTrafficData(this.region).subscribe({
      next: (response) => {
        console.log('Traffic data load initiated successfully:', response);
        // Optionally, you can show a success message to the user here
        this.showTrafficData = true;
        this.alertMessage = response?.message || 'Traffic data load initiated successfully.';
        this.hideAlert();
      },
      error: (error) => {
        console.error('Error loading traffic data:', error);
        this.showTrafficData = true;
        this.errorLoadingTrafficData = true;
        this.alertMessage = error?.error?.message || 'An error occurred while loading traffic data.';
        this.hideAlert();
        // Optionally, you can show an error message to the user here
      }
    });
  }

  hideAlert() {
    setTimeout(() => {
      this.showTrafficData = false;
      this.errorLoadingTrafficData = false;
    }, 5000);
  }

  getSignalStatus() {
    this.signalService.getSignalStatus().subscribe((data) => {
      this.signalStatus = data;
      this.createTotalVehiclesChart();
      this.createVehicleTypeBreakdownChart();
      this.createCongestionPieChart();
    });
  }

  editManualOverride(s: SignalStatus) {
    console.log('Editing manual override for signal:', s);
    this.modalRef = this.modalService.show(ManualOverride, {
      initialState: {
        signalData: s
      }
    });
    this.onHiddenModal(this.modalRef);
  }

  onHiddenModal(modalRef: BsModalRef) {
    modalRef.onHidden?.subscribe(() => {
      console.log('Modal closed');
      this.getSignalStatus();
    });
  }

  /**
   * 1. Total Vehicle Count by Signal (Column Chart)
   */
  private createTotalVehiclesChart(): void {
    const categories = this.signalStatus.map(data => data.signalLocation);
    const dataSeries = this.signalStatus.map(data => ({
      name: data.signalLocation,
      y: data.lmvCount + data.hmvCount + data.htvCount + data.mcwgCount + data.mgvCount,
      // Highlight congested signals in Red
      color: data.congested ? '#EF5350' : '#66BB6A'
    }));

    this.totalVehiclesChartOptions = {
      chart: { type: 'column' },
      title: { text: 'Total Vehicle Count by Location' },
      xAxis: { categories: categories, title: { text: 'Traffic Signal Location' } },
      yAxis: { min: 0, title: { text: 'Total Vehicle Count' } },
      tooltip: { headerFormat: '<b>{point.key}</b><br/>', pointFormat: 'Total Vehicles: <b>{point.y}</b>' },
      legend: { enabled: false },
      series: [{
        name: 'Total Vehicles',
        data: dataSeries,
        type: 'column'
      }]
    };
  }

  /**
   * 2. Vehicle Type Breakdown (Stacked Column Chart)
   */
  private createVehicleTypeBreakdownChart(): void {
    const categories = this.signalStatus.map(data => data.signalLocation);

    // Create series for each vehicle type
    const lmvData = this.signalStatus.map(d => d.lmvCount);
    const mcwgData = this.signalStatus.map(d => d.mcwgCount);
    const mgvData = this.signalStatus.map(d => d.mgvCount);
    const hmvData = this.signalStatus.map(d => d.hmvCount);
    const htvData = this.signalStatus.map(d => d.htvCount);

    this.vehicleTypeBreakdownChartOptions = {
      chart: { type: 'column' },
      title: { text: 'Vehicle Type Breakdown Across Locations' },
      xAxis: { categories: categories },
      yAxis: {
        min: 0,
        title: { text: 'Vehicle Count' },
        stackLabels: { enabled: true, format: '{total}' } // Show total on stack
      },
      legend: { reversed: true },
      plotOptions: {
        series: {
          stacking: 'normal', // Stacks the columns
          dataLabels: { enabled: false }
        }
      },
      series: [
        { name: 'HTV (Heavy Transport)', data: htvData, type: 'column' },
        { name: 'HMV (Heavy Motor)', data: hmvData, type: 'column' },
        { name: 'MGV (Medium Goods)', data: mgvData, type: 'column' },
        { name: 'MCWG (Motor Cycle)', data: mcwgData, type: 'column' },
        { name: 'LMV (Light Motor)', data: lmvData, type: 'column' }
      ]
    };
  }


  /**
   * 3. Congestion Status Distribution (Pie Chart)
   */
  private createCongestionPieChart(): void {
    const congestedCount = this.signalStatus.filter(d => d.congested).length;
    const notCongestedCount = this.signalStatus.filter(d => !d.congested).length;

    this.congestionPieChartOptions = {
      chart: { type: 'pie' },
      title: { text: 'Congestion Status Distribution' },
      tooltip: { pointFormat: '<b>{point.y} signals ({point.percentage:.1f}%)</b>' },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f} %' }
        }
      },
      series: [{
        name: 'Signals',
        data: [{
          name: 'Congested',
          y: congestedCount,
          color: '#EF5350' // Red
        }, {
          name: 'Not Congested',
          y: notCongestedCount,
          color: '#66BB6A', // Green
          sliced: true,
          selected: true
        }],
        type: 'pie'
      }]
    };
  }
}
