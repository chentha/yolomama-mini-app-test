import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { telegramGuard } from './core/guards/telegram-guard';

export const routes: Routes = [
    {
        path: 'forbidden',
        loadComponent: () =>
        import('./pages/forbidden-page/forbidden-page').then(c => c.ForbiddenPage),
    },
    {
        path: '',
        canActivate: [telegramGuard],         
        canActivateChild: [telegramGuard],  
        loadComponent: () =>
        import('./layouts/home/home').then(c => c.Home),
        // canActivate: [authGuard],
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
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/checkout/checkout-page/checkout-page').then(c => c.CheckoutPage)
            },
            // {
            //     path: 'payment-confirm/:id',
            //     canActivate: [authGuard],
            //     loadComponent: () =>
            //         import('./pages/payment-confirm/payment-confirm').then(c => c.PaymentConfirm)
            // },
            // {
            //     path: 'payment-confirm',
            //     redirectTo: 'product-list',
            //     pathMatch: 'full'
            // },
            // {
            //     path: 'payment-completed',
            //     canActivate: [authGuard],
            //     loadComponent: () =>
            //         import('./pages/payment-completed/payment-completed').then(c => c.PaymentCompleted)
            // },
            {
                path: 'payment-method/:data',
                // canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/payment-method/payment-method').then(c => c.PaymentMethod)
            },
            {
                path: 'aba-payment/:data',
                // canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/aba-payment/aba-payment').then(c => c.AbaPayment)
            },
             {
                path: 'forbidden',
                // canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/forbidden-page/forbidden-page').then(c => c.ForbiddenPage)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'forbidden',
    },
];
