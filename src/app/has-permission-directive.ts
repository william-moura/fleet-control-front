import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from './services/auth-service';
import { Permission } from './models/permission';

@Directive({
  selector: '[appHasPermissionDirective]'
})
export class HasPermissionDirective implements OnInit{
  @Input() appHasPermission!: Permission;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.hasPermission(this.appHasPermission.name)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
