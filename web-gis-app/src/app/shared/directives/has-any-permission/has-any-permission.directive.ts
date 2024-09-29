import {
  OnInit,
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Directive({
  selector: '[appHasAnyPermission]',
})
export class HasAnyPermissionDirective implements OnInit {
  @Input() appHasAnyPermission!: string | string[] | undefined | any;

  isVisible = false;

  constructor(
    private authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    console.log(this.authService.hasAnyPermission(this.appHasAnyPermission));
    if (this.authService.hasAnyPermission(this.appHasAnyPermission)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }
}
