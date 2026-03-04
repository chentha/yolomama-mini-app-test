import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./layouts/home/home').then(c => c.Home),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'product-list'
            },
            {
                path: 'product-list',
                loadComponent: () =>
                    import('./pages/products/product-list/product-list').then(c => c.ProductList)
            },
            {
                path: 'checkout',
                // canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/checkout/checkout-page/checkout-page').then(c => c.CheckoutPage)
            },
            {
                path: 'payment-confirm',
                // canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/payment-confirm/payment-confirm').then(c => c.PaymentConfirm)
            }
        ]
    }
];
