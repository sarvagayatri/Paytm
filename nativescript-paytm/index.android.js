var app = require("application");
var utils = require("utils/utils");
var newPayment = function (arg) {
    // //Getting the Service Instance. PaytmPGService.getStagingService()  will return the Service 
    // //pointing to Staging Environment and PaytmPGService.getProductionService() will return the 
    // //Service pointing to Production Environment.

    var service = com.paytm.pgsdk.PaytmPGService.getStagingService();

    // //  var service = com.paytm.pgsdk.PaytmPGService.getProductionService();

    // //Create new order Object having all order information.

    var merchant = arg.merchant;
    var customer = arg.customer;
    var checksumUrls = arg.checksumUrls;

    // var paramObject = {};
    var paramObject = {
        ORDER_ID: customer.orderId,
        MID: merchant.id,
        CUST_ID: customer.id,
        CHANNEL_ID: merchant.channelId,
        INDUSTRY_TYPE_ID: merchant.industryTypeId,
        WEBSITE: merchant.website,
        TXN_AMOUNT: customer.txnAmount,
        THEME: "merchant",
        EMAIL: customer.email,
        MOBILE_NO: customer.mobileNumber,
        REQUEST_TYPE: "DEFAULT"
    }
    var paramMap = toHashMap(paramObject);
    console.log("parammap:::", paramMap);

    var order = new com.paytm.pgsdk.PaytmOrder(paramMap);
    console.log("Order:::", order);

    // //Create new Merchant Object having all merchant configuration.
    var merchant = new com.paytm.pgsdk.PaytmMerchant(checksumUrls.generation, checksumUrls.verification);
    console.log("Merchant:::", merchant);

    // //Set PaytmOrder and PaytmMerchant objects. Call this method and set both objects before starting transaction.
    service.initialize(order, merchant, null);
    console.log("Service intialised");

    //Start the Payment Transaction. Before starting the transaction ensure that initialize method is called.
    service.startPaymentTransaction(
        utils.ad.getApplicationContext(), false, true, 
        new com.paytm.pgsdk.PaytmPaymentTransactionCallback({
    onTransactionSuccess(paramBundle) {
        android.widget.Toast.makeText(app.android.context, "Transaction Successful", android.widget.Toast.LENGTH_SHORT).show();
    },

    onTransactionFailure(paramString, paramBundle) {
        android.widget.Toast.makeText(app.android.context, "Transaction Failure", android.widget.Toast.LENGTH_SHORT).show();
    },

    networkNotAvailable() {
        android.widget.Toast.makeText(app.android.context, "Check Network connection", android.widget.Toast.LENGTH_SHORT).show();
    },

    clientAuthenticationFailed(paramString) {
        android.widget.Toast.makeText(app.android.context, "Client Authentication Failed", android.widget.Toast.LENGTH_SHORT).show();
    },

    someUIErrorOccurred(paramString) {
        android.widget.Toast.makeText(app.android.context, "UI Error Occur", android.widget.Toast.LENGTH_SHORT).show();
    },

    onErrorLoadingWebPage(paramInt, paramString1, paramString2) {
        android.widget.Toast.makeText(app.android.context, "Error On Loading", android.widget.Toast.LENGTH_SHORT).show();
    },

    onBackPressedCancelTransaction() {
        android.widget.Toast.makeText(app.android.context, "Back Button pressed by user", android.widget.Toast.LENGTH_SHORT).show();
    }
})
        );
}
var callbackMethods = new com.paytm.pgsdk.PaytmPaymentTransactionCallback({
    onTransactionSuccess: function (paramBundle) {
        android.widget.Toast.makeText(app.android.context, "Transaction Successful", android.widget.Toast.LENGTH_SHORT).show();
    },

    onTransactionFailure: function (paramString, paramBundle) {
        android.widget.Toast.makeText(app.android.context, "Transaction Failure", android.widget.Toast.LENGTH_SHORT).show();
    },

    networkNotAvailable: function () {
        android.widget.Toast.makeText(app.android.context, "Check Network connection", android.widget.Toast.LENGTH_SHORT).show();
    },

    clientAuthenticationFailed: function (paramString) {
        android.widget.Toast.makeText(app.android.context, "Client Authentication Failed", android.widget.Toast.LENGTH_SHORT).show();
    },

    someUIErrorOccurred: function (paramString) {
        android.widget.Toast.makeText(app.android.context, "UI Error Occur", android.widget.Toast.LENGTH_SHORT).show();
    },

    onErrorLoadingWebPage: function (paramInt, paramString1, paramString2) {
        android.widget.Toast.makeText(app.android.context, "Error On Loading", android.widget.Toast.LENGTH_SHORT).show();
    },

    onBackPressedCancelTransaction: function () {
        android.widget.Toast.makeText(app.android.context, "Back Button pressed by user", android.widget.Toast.LENGTH_SHORT).show();
    }
});

var toHashMap = function (obj) {
    var node = new java.util.HashMap();
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (obj[property] !== null) {
                node.put(property, String(obj[property]));
            }
        }
    }
    return node;
};

exports.newPayment = newPayment;