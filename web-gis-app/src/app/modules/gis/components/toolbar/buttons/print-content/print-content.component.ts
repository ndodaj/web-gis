import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-content',
  templateUrl: './print-content.component.html',
  styleUrls: ['./print-content.component.scss'],
})
export class PrintContentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.selectPrintButton();

    const print = document.querySelector('.ol-print') as any;
    print.style.background = 'transparent';
  }

  selectPrintButton() {
    const olPrintButton = document.querySelector('.ol-print') as HTMLElement;
    const buttonsContainer = document.querySelector(
      '#printContent'
    ) as HTMLElement;
    const olPrintButtonEl = document.querySelector(
      '.ol-print button'
    ) as HTMLElement;
    olPrintButtonEl.style.display = 'inline';
    olPrintButtonEl.style.width = '100%';
    olPrintButtonEl.style.height = '100%';
    olPrintButtonEl.style.margin = '0';
    olPrintButtonEl.style.opacity = '0';
    olPrintButton.style.display = 'inline';
    olPrintButton.style.position = 'absolute';
    olPrintButton.style.top = '-4px';
    olPrintButton.style.left = '0';
    olPrintButton.style.bottom = '0';
    olPrintButton.style.right = '0';
    olPrintButton.style.width = '100%';
    olPrintButton.style.height = '100%';
    buttonsContainer.appendChild(olPrintButton);
  }
}
