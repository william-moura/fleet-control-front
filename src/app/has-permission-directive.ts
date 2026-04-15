import { Directive, effect, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from './services/auth-service';
import { Permission } from './models/permission';

@Directive({
  selector: '[appHasPermissionDirective]'
})
export class HasPermissionDirective {
  @Input('appHasPermission') set permission(val: string) {
    effect(() => {
      const permissions = this.authService.permissions();
      this.updateView(val, permissions);
    });
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  private updateView(requiredPermission: string, currentPermissions: string[]) {
    this.viewContainer.clear();
    if (currentPermissions.includes(requiredPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
