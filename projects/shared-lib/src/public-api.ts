/*
 * Public API Surface of shared-lib
 */

// Models
export * from './lib/models/user.model';

// Interceptors
export { mockApiInterceptor } from './lib/interceptors/mock-api.interceptor';

// Components
export { ConfirmDialogComponent } from './lib/components/confirm-dialog/confirm-dialog.component';
export type { ConfirmDialogData } from './lib/components/confirm-dialog/confirm-dialog.component';
export { LoadingSpinnerComponent } from './lib/components/loading-spinner/loading-spinner.component';

// Pipes
export { RoleBadgeColorPipe } from './lib/pipes/role-badge.pipe';
export { StatusLabelPipe } from './lib/pipes/status-label.pipe';
