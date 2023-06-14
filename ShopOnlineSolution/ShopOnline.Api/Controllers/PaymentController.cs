using Iyzipay.Model;
using Iyzipay.Request;
using Iyzipay;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using ShopOnline.Api.Request;
using Newtonsoft.Json.Linq;
using System.Text;
using ShopOnline.Api.Repositories.Contracts;
using ShopOnline.Api.Entities;
using ShopOnline.Api.Extensions;
using ShopOnline.Models.Dtos;
using Iyzipay.Model.V2.Subscription;
using ShopOnline.Api.Repositories;
using static ShopOnline.Api.Enums.Enum;

namespace ShopOnline.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IShoppingCartRepository shoppingCartRepository;
        private readonly IProductRepository productRepository;    
        public PaymentController(IShoppingCartRepository shoppingCartRepository, IProductRepository productRepository)
        {
            this.shoppingCartRepository = shoppingCartRepository;
            this.productRepository = productRepository;
        }
        private static Iyzipay.Options IyzipayOptions()
        {
            return new Iyzipay.Options
            {
                ApiKey = "sandbox-VtyDYGdIKgddfOvbW98Aff4GC9mAncrt",
                SecretKey = "sandbox-8UMFXPp5WzN0nIbQBLh58BHS43U4ZZe7",
                BaseUrl = "https://sandbox-api.iyzipay.com"
            };
        }

        [HttpPost("CreatePayment")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest paymentrequest)
        {
            Iyzipay.Options options = IyzipayOptions();

            CreateCheckoutFormInitializeRequest request = new CreateCheckoutFormInitializeRequest();
            SetCheckoutFormProperties(request);
            EnabledInstallments(request);
            Buyer(request);
            ShippingAddress(request);
            BillingAddress(request);
            await BasketItems(request, paymentrequest.CartId);
            CheckoutFormInitialize checkoutFormInitialize = CheckoutFormInitialize.Create(request, options);
            
            return Ok(checkoutFormInitialize);
        }

        private static void SetCheckoutFormProperties(CreateCheckoutFormInitializeRequest request)
        {
            request.Locale = Locale.TR.ToString();
            request.ConversationId = "123456789";
            request.Currency = Currency.TRY.ToString();
            request.BasketId = "B67832";
            request.PaymentGroup = PaymentGroup.PRODUCT.ToString();
            request.CallbackUrl = "https://localhost:7119/api/Payment/RetrieveCheckoutForm/" + request.ConversationId;
        }


        private async Task BasketItems(CreateCheckoutFormInitializeRequest request,int cartId)
        {
            List<BasketItem> basketItems = new List<BasketItem>();
            IEnumerable<CartItemDto> cartItemsDto = await CartItems(cartId);
         
            
            decimal totalPrice = 0;
            foreach (var cartItem in cartItemsDto)
            {
                BasketItem basketItem = new BasketItem();
                basketItem.Id = cartItem.Id.ToString();
                basketItem.Name = cartItem.ProductName;
                basketItem.Category1 = cartItem.ProductDescription;
                basketItem.ItemType = BasketItemType.PHYSICAL.ToString();
                basketItem.Price = cartItem.TotalPrice.ToString();
                basketItems.Add(basketItem); 
                totalPrice += cartItem.TotalPrice;
            }
            request.Price = totalPrice.ToString();
            request.PaidPrice = totalPrice.ToString();
            request.BasketItems = basketItems;
        }

        private async Task<IEnumerable<CartItemDto>> CartItems(int cartId)
        {
            var userId = cartId;
            var cartItems = await this.shoppingCartRepository.GetItems(userId);

            if (cartItems == null || cartItems.Count() == 0)
            {
                //uygun yapı bul
            }

            var products = await this.productRepository.GetItems();

            if (products == null || products.Count() == 0)
            {
                //uygun yapı bul
            }

            var cartItemsDto = cartItems.ConvertToDto(products);

            return cartItemsDto;
        }

        private static void BillingAddress(CreateCheckoutFormInitializeRequest request)
        {
            Address billingAddress = new Address();
            billingAddress.ContactName = "Jane Doe";
            billingAddress.City = "Istanbul";
            billingAddress.Country = "Turkey";
            billingAddress.Description = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
            billingAddress.ZipCode = "34742";
            request.BillingAddress = billingAddress;
        }

        private static void ShippingAddress(CreateCheckoutFormInitializeRequest request)
        {
            Address shippingAddress = new Address();
            shippingAddress.ContactName = "Jane Doe";
            shippingAddress.City = "Istanbul";
            shippingAddress.Country = "Turkey";
            shippingAddress.Description = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
            shippingAddress.ZipCode = "34742";
            request.ShippingAddress = shippingAddress;
        }

        private static void Buyer(CreateCheckoutFormInitializeRequest request)
        {
            Buyer buyer = new Buyer();
            buyer.Id = "BY789";
            buyer.Name = "John";
            buyer.Surname = "Doe";
            buyer.GsmNumber = "+905350000000";
            buyer.Email = "email@email.com";
            buyer.IdentityNumber = "74300864791";
            buyer.LastLoginDate = "2015-10-05 12:43:35";
            buyer.RegistrationDate = "2013-04-21 15:12:09";
            buyer.RegistrationAddress = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
            buyer.Ip = "85.34.78.112";
            buyer.City = "Istanbul";
            buyer.Country = "Turkey";
            buyer.ZipCode = "34732";
            request.Buyer = buyer;
        }

        private static void EnabledInstallments(CreateCheckoutFormInitializeRequest request)
        {
            List<int> enabledInstallments = new List<int>();
            enabledInstallments.Add(2);
            enabledInstallments.Add(3);
            enabledInstallments.Add(6);
            enabledInstallments.Add(9);
            request.EnabledInstallments = enabledInstallments;
        }

        [HttpPost("RetrieveCheckoutForm/{conversationId}")]
        public IActionResult RetrieveCheckoutForm([FromForm] string token, [FromRoute] string conversationId)
        {
            Iyzipay.Options options = IyzipayOptions();
            RetrieveCheckoutFormRequest request = new RetrieveCheckoutFormRequest();
            request.ConversationId = conversationId;
            request.Token = token;

            CheckoutForm checkoutForm = CheckoutForm.Retrieve(request, options);
            return Ok(checkoutForm);
        }




    }
}
