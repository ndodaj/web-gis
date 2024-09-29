import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appEllipsisTooltip]'
})
export class EllipsisTooltipDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    if (element.offsetWidth < element.scrollWidth) {
      this.addTooltip(element);
    }
  }

  private addTooltip(element: HTMLElement): void {
    const tooltip = this.renderer.createElement('div');
    this.renderer.setAttribute(
      tooltip,
      'class',
      'absolute bg-black bg-opacity-80 text-white py-1 px-2 rounded text-xs z-10  hidden'
    );
    this.renderer.appendChild(
      tooltip,
      this.renderer.createText(element.innerText)
    );
    this.renderer.appendChild(document.body, tooltip);

    const showTooltip = () => {
      const rect = element.getBoundingClientRect();
      tooltip.style.top = rect.top + 'px';
      tooltip.style.left = rect.right + 'px';
      tooltip.style.display = 'block';
    };

    const hideTooltip = () => {
      tooltip.style.display = 'none';
    };

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  }
}
