import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';
import { ShoppingCart } from '../shoppingcart';
import { PaymentService } from 'src/app/service/payment.service';
import { Payment } from './payment';
import { checkoutFormContent } from './paymentContent';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers:[CartService, PaymentService]
})
export class PaymentComponent implements OnInit {
  scriptContent!: string;

  constructor(private cartService:CartService,private paymentService:PaymentService){}

  shoppingCarts: ShoppingCart[]=[];
  model1 :Payment =new Payment;
  model2 : checkoutFormContent = new checkoutFormContent;
  private userId = 2

  ngOnInit() {
    this.cartService.GetCartByUser(this.userId).subscribe(response => {
      this.shoppingCarts = response
    });
    
  }

  sendPostRequest() { 
    this.model1.cartId = 2;    
    this.paymentService.PostPayment(this.model1).subscribe(response => { 
      debugger
     this.model2 = response      
   });
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
