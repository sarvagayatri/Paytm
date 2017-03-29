import { Component, OnInit } from "@angular/core";
import { Item } from "./item";
import { ItemService } from "./item.service";
let app = require("application");
let utils = require("utils/utils");

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Item[];

    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.items = this.itemService.getItems();
    }
    public onTap() {
        let date = new Date();
        this.newPayment({
            merchant: {
                id: "Xavica12768024115898",
                channelId: "WEB",
                industryTypeId: "Retail",
                website: "WEB_STAGING"
            },
            customer: {
                id: 'C' + date.getTime(),
                email: "sarvagayatri@gmail.com",
                mobileNumber: "8689835231",
                orderId: 'O' + date.getTime(),
                txnAmount: "50"
            },
            checksumUrls: {
                generation: "http://dev-qwipo.azurewebsites.net/paytm/GenerateChecksum.aspx",
                verification: "http://dev-qwipo.azurewebsites.net/paytm/verifychecksum.aspx"
            }
        });
    }

    public newPayment(arg) {
        let service = com.paytm.pgsdk.PaytmPGService.getStagingService();

        let merchantObject: any = arg.merchant;
        let customer: any = arg.customer;
        let checksumUrls: any = arg.checksumUrls;

        let paramObject = {
            ORDER_ID: customer.orderId,
            MID: merchantObject.id,
            CUST_ID: customer.id,
            CHANNEL_ID: merchantObject.channelId,
            INDUSTRY_TYPE_ID: merchantObject.industryTypeId,
            WEBSITE: merchantObject.website,
            TXN_AMOUNT: customer.txnAmount,
            THEME: "merchant",
            EMAIL: customer.email,
            MOBILE_NO: customer.mobileNumber,
            REQUEST_TYPE: "DEFAULT"
        }
        let paramMap = new java.util.HashMap<java.lang.String, java.lang.String>();
        paramMap.put(new java.lang.String("ORDER_ID"), customer.orderId);
        paramMap.put(new java.lang.String("MID"), merchantObject.id);
        paramMap.put(new java.lang.String("CUST_ID"), customer.id);
        paramMap.put(new java.lang.String("CANNEL_ID"), merchantObject.channelId);
        paramMap.put(new java.lang.String("INDUSTRY_TYPE_ID"), merchantObject.industryTypeId);
        paramMap.put(new java.lang.String("WEBSITE"), merchantObject.website);
        paramMap.put(new java.lang.String("TXN_AMOUNT"), customer.txnAmount);
        paramMap.put(new java.lang.String("THEME"), new java.lang.String("merchant"));
        paramMap.put(new java.lang.String("EMAIL"), customer.email);
        paramMap.put(new java.lang.String("MOBILE_NO"), customer.mobileNumber);
        paramMap.put(new java.lang.String("REQUEST_TYPE"), new java.lang.String("DEFAULT"));

        // let paramMap = this.toHashMap(paramObject);
        console.log("parammap:::", paramMap);

        let order = new com.paytm.pgsdk.PaytmOrder(paramMap);
        console.log("Order:::", order);

        // //Create new Merchant Object having all merchant configuration.
        let merchant = new com.paytm.pgsdk.PaytmMerchant(checksumUrls.generation, checksumUrls.verification);
        console.log("Merchant:::", merchant);

        // //Set PaytmOrder and PaytmMerchant objects. Call this method and set both objects before starting transaction.
        service.initialize(order, merchant, null);
        console.log("Service intialised");

        //Start the Payment Transaction. Before starting the transaction ensure that initialize method is called.
        service.startPaymentTransaction(
            utils.ad.getApplicationContext(), false, true,
            new com.paytm.pgsdk.PaytmPaymentTransactionCallback({
                onTransactionSuccess: function (paramBundle) {
                    app.android.widget.Toast.makeText(app.app.android.context, "Transaction Successful", app.android.widget.Toast.LENGTH_SHORT).show();
                },

                onTransactionFailure: function (paramString, paramBundle) {
                    app.android.widget.Toast.makeText(app.app.android.context, "Transaction Failure", app.android.widget.Toast.LENGTH_SHORT).show();
                },

                networkNotAvailable: function () {
                    app.android.widget.Toast.makeText(app.app.android.context, "Check Network connection", app.android.widget.Toast.LENGTH_SHORT).show();
                },

                clientAuthenticationFailed: function (paramString) {
                    app.android.widget.Toast.makeText(app.app.android.context, "Client Authentication Failed", app.android.widget.Toast.LENGTH_SHORT).show();
                },

                someUIErrorOccurred: function (paramString) {
                    app.android.widget.Toast.makeText(app.app.android.context, "UI Error Occur", app.android.widget.Toast.LENGTH_SHORT).show();
                },

                onErrorLoadingWebPage: function (paramInt, paramString1, paramString2) {
                    app.android.widget.Toast.makeText(app.app.android.context, "Error On Loading", app.android.widget.Toast.LENGTH_SHORT).show();
                },

                onBackPressedCancelTransaction: function () {
                    app.android.widget.Toast.makeText(app.app.android.context, "Back Button pressed by user", app.android.widget.Toast.LENGTH_SHORT).show();
                }
            })
        );
    }
    // toHashMap(obj): any {
    //     let node = new java.util.HashMap<java.lang.String, java.lang.String>();
    //     for (let property in obj) {
    //         if (obj.hasOwnProperty(property)) {
    //             if (obj[property] !== null) {
    //                 node.put(property, String(obj[property]));
    //             }
    //         }
    //     }
    //     return node;
    // }

}
