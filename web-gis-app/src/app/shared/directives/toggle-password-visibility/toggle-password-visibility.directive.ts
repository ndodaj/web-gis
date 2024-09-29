import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  Renderer2,
  EmbeddedViewRef
} from '@angular/core';
import { PasswordButtonComponent } from './password-button.component';

@Directive({
  selector: '[appTogglePasswordVisibility]'
})
export class TogglePasswordVisibilityDirective {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.resolveAndAttachComponent();
  }

  resolveAndAttachComponent() {
    const embViewRef = this.viewContainer.createEmbeddedView(this.templateRef);

    const formFieldFlexElement = embViewRef.rootNodes[0].querySelector(
      '.mat-mdc-form-field-flex'
    );

    const inputPassword = formFieldFlexElement.querySelector(
      'input[type=password]'
    );

    const componentRef = this.viewContainer.createComponent(
      PasswordButtonComponent
    );

    componentRef.instance.clickEvent.subscribe((event) => {
      this.renderer.setAttribute(
        inputPassword,
        'type',
        event ? 'text' : 'password'
      );
    });

    this.renderer.setAttribute(
      (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0],
      'matSuffix',
      ''
    );

    this.renderer.appendChild(
      formFieldFlexElement,
      (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]
    );
  }
}
