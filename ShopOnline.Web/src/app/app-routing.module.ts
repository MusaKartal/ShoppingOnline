import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
import { PaymentComponent } from './shoppingcart/payment/payment.component';

const routes: Routes = [
  {path:'product',component : ProductComponent},
  {path :'product/category/:categoryId', component : ProductComponent},
  { path: 'product/:productId', component : ProductDetailComponent },
  {path: '' , component : ProductComponent},
  { path: '', redirectTo: 'product', pathMatch: 'full' },
  {path : 'shoppingcart' ,component : ShoppingcartComponent},
  {path: 'payment' , component : PaymentComponent}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
