import { Component, OnInit} from '@angular/core';
import { CartService } from '../service/cart.service';
import { ShoppingCart } from './shoppingcart';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css'],
  providers:[CartService]
})
export class ShoppingcartComponent implements OnInit {
  
  constructor(private cartService:CartService,){}
   shoppingCarts: ShoppingCart[]=[];
   shoppingCart!: ShoppingCart;
   
   model: ShoppingCart = new ShoppingCart();
   private userId = 2

  ngOnInit() 
  {
    this.cartService.GetCartByUser(this.userId).subscribe(response => {
      this.shoppingCarts = response
    });
 
  }



  CartRemove(ShoppingCartId: number) {
    this.cartService.CartRemove(ShoppingCartId).subscribe(response => {
    this.shoppingCarts = this.shoppingCarts.filter(item => item.id != response.id);
    });
  }

  CartPatch(ShoppingCartId: number, form: NgForm) {
    if (form.valid) {
      if(this.model.qty == 0){
        this.model.qty = 1;
      }
      this.cartService.CartPatch(ShoppingCartId, this.model).subscribe(response => {
        const updatedItemIndex = this.shoppingCarts.findIndex(item => item.id === response.id);
        if (updatedItemIndex !== -1) {
          this.shoppingCarts = this.shoppingCarts.map(item => {
            if (item.id === response.id) {
              return response; // Güncellenen ürünü yerine koy
            }
            return item;
          });
        }
      });
    }
  }

  calculateTotalPrice(): number {
    let total = 0;
    for (let item of this.shoppingCarts) {
      // total += item.price * item.qty;
      total += item.totalPrice;
    }
    return total;
  }
}
