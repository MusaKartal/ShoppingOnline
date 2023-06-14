import { Component, OnInit } from '@angular/core';
import { Product } from './product';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService]
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}
    
 

  ngOnInit() {
    this.productService.getProducts().subscribe(data => this.products = data);
    // this.productService.GetItemsByCategory().subscribe(data => this.products = data);

    this.activatedRoute.params.subscribe(params => {
      this.productService.GetItemsByCategory(params["categoryId"]).subscribe(data => {
        this.products = data
      });
    })
  }


}
