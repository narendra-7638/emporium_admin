import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { CustomersComponent } from './customers/customers.component';
import { ProductsComponent } from './products/products.component';
import { MainComponent } from './main.component';

import { AuthGuardService as Auth} from './services/auth-guard.service';

const routes: Routes = [
    // { path: "", redirectTo: "/dashboard" },
    // { path: "", component: DashboardComponent },
    // { path: "categories", component: CategoriesComponent },
    // { path: "customers", component: CustomersComponent },
    // { path: "products", component: ProductsComponent }
    {
        path: "", component: MainComponent, canActivate: [Auth], children: [
            { path: "", canActivate: [Auth], component: DashboardComponent },
            { path: "customers", canActivate: [Auth], component: CustomersComponent },
            { path: "categories", canActivate: [Auth], component: CategoriesComponent },
            { path: "products", canActivate: [Auth], component: ProductsComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRouting { }
