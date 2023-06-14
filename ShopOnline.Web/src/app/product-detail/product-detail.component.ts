import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../product/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../service/cart.service';
import { Cart } from '../shoppingcart/cart';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [CartService]
})
export class ProductDetailComponent implements OnInit {

  
   constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute
  
  ) { }

  product!: Product;
  model: Cart = new Cart();
  
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.productService.GetByProduct(params["productId"]).subscribe(data => {
        this.product = data
      });
    })  
  }

  sendPostRequest(form: NgForm) {
    const productId = this.product.id;
     this.model.CartId = 2;
     this.model.ProductId = productId;
     this.model.Qty = (this.model.Qty === undefined) ? 1 : this.model.Qty;
      
    this.cartService.postCart(this.model).subscribe(response => {
      this.model = response
      
    });
  }


}
