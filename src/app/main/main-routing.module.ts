import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { CustomersComponent } from './customers/customers.component';
import { ProductsComponent } from './products/products.component';
import { MainComponent } from './main.component';


const routes: Routes = [
    // { path: "", redirectTo: "/dashboard" },
    // { path: "", component: DashboardComponent },
    // { path: "categories", component: CategoriesComponent },
    // { path: "customers", component: CustomersComponent },
    // { path: "products", component: ProductsComponent }
    {
        path: "", component: MainComponent, children: [
            { path: "", component: DashboardComponent },
            { path: "customers", component: CustomersComponent },
            { path: "categories", component: CategoriesComponent },
            { path: "products", component: ProductsComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRouting { }
