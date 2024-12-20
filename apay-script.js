// ==UserScript==
// @name         AmazonPay
// @namespace    http://tampermonkey.net/
// @version      2024-07-12
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.in/pay/history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.in
// @grant        none
// ==/UserScript==

class Transaction {
    constructor(date, description, amount) {
        this.date = date.trim();
        this.description = description.trim();
        this.amount = parseFloat(amount.trim().replace(/[^\d.-]/g, ''));
    }

    print() {
        console.log(`${this.date}, ${this.description}, ${this.amount}`);
    }

    isCashback() {
        return this.description.toLowerCase().includes('cashback');
    }

    isBlinkitTransaction() {
        return this.description.toLowerCase().includes('paid on blinkit commerce');
    }

    isZomatoTransaction() {
        return this.description.toLowerCase().includes('paid on zomato limited');
    }

    isZomatoDiningTransaction() {
        return this.description.toLowerCase().includes('paid on zomato dining');
    }

    isSwiggyTransaction() {
        return this.description.toLowerCase().includes('paid on swiggy')
            && !this.isInstamartTransaction();
    }

    isInstamartTransaction() {
        return this.description.toLowerCase().includes('paid on swiggy business');
    }

    isUberTransaction() {
        return this.description.toLowerCase().includes('paid on uber india');
    }

    isUberReleasedTransaction() {
        return this.description.toLowerCase().includes('released from uber india');
    }

    isUberOnHoldTransaction() {
        return this.description.toLowerCase().includes('on-hold for uber india');
    }

    isRapidoTransaction() {
        return this.description.toLowerCase().includes('paid on rapido bikes');
    }

    isQuickRideTransaction() {
        return this.description.toLowerCase().includes('paid on quickride');
    }

    isApolloPharmacyTransaction() {
        return this.description.toLowerCase().includes('paid on apollo 24|7 pharmacy');
    }

    isInsurancePremiumTransaction() {
        return this.description.toLowerCase().includes('insurance premium payment');
    }

    isOlaTransaction() {
        return this.description.toLowerCase().includes('paid on ola cabs');
    }

    isOlaReleaseTransaction() {
        return this.description.toLowerCase().includes('released from ola cabs');
    }

    isOlaOnHoldTransaction() {
        return this.description.toLowerCase().includes('on-hold for ola cabs');
    }

    isSmartqTransaction() {
        return this.description.toLowerCase().includes('paid on smartq');
    }

    isAmazonVendingTransaction() {
        return this.description.toLowerCase().includes('paid on mobivend logistics solutions private limited');
    }

    isRefundTransaction() {
        return this.description.toLowerCase().includes('refund');
    }

    isGiftCardTransaction() {
        return this.description.toLowerCase().includes('added amazon pay gift card');
    }

    isAutoReloadTransaction() {
        return this.description.toLowerCase().includes('auto reload set up');
    }

    isWalletReloadTransaction() {
        return this.description.toLowerCase().includes('added money');
    }

    isElectricityTransaction() {
        return this.description.toLowerCase().includes('electricity bill payment');
    }

    isPipedGasTransaction() {
        return this.description.toLowerCase().includes('piped gas payment');
    }

    isCreditCardBillPaymentTransaction() {
        return this.description.toLowerCase().includes('credit card bill payment');
    }

    isAmazonPayRewardTransaction() {
        return this.description.toLowerCase().includes('Paid on MOBIVEND LOGISTICS SOLUTIONS PRIVATE LIMITED');
    }

    isMobileRechargeTransaction() {
        return this.description.toLowerCase().includes('mobile prepaid recharge');
    }

    isICICIRewardRechargeTransaction() {
        return this.description.toLowerCase().includes('amazon pay icici bank credit card: rewards earned for last billing cycle');
    }

    bypassFilter() {
        return true;
    }

}

(function () {
    'use strict';

    let scriptExecutionDelay = 60000; // ensure the page is fully loaded after this time

    setTimeout(function () {

        console.log("Script is working ..");

        const statement_element_id = "transactions-desktop";

        const statement = document.getElementById(statement_element_id)

        // statement method
        function extractTransactionFromStatement(statement) {
            return statement.querySelectorAll(':scope > span');
        }

        // transaction method
        function extractDescriptionFromTransaction(transaction) {
            return transaction.querySelector('.a-size-medium.a-color-base');
        }

        function extractAmountFromTransaction(transaction) {
            let attainable_element = transaction.querySelector('.a-color-attainable');
            let price_element = transaction.querySelector('.a-color-price');
            if (attainable_element) return attainable_element;
            return price_element;
        }

        function extractDateFromTransaction(transaction) {
            let spanElements = transaction.querySelectorAll('.a-size-base.a-color-tertiary');
            return Array.from(spanElements).find(element => {
                return /\d{1,2}\s[A-Za-z]{3}\s\d{4},\s\d{1,2}:\d{2}\s(?:AM|PM)/.test(element.textContent.trim());
            });
        }

        function sumTransactionsMatchingPredicate(transactions, predicate) {
            return transactions.reduce((sum, transaction) => {
                if (predicate(transaction)) {
                    sum += transaction.amount;
                }
                return sum;
            }, 0); // Initialize sum as 0
        }

        function sumAllTransactions(transactions) {
            return transactions.reduce((sum, transaction) => {
                sum += transaction.amount;
                return sum;
            }, 0); // Initialize sum as 0
        }

        let transactionEntriesElement = extractTransactionFromStatement(statement);

        let transactions = [];
        for (let i = 0; i < transactionEntriesElement.length; i++) {

            let transactionElement = transactionEntriesElement[i];
            let transactionAmountElement = extractAmountFromTransaction(transactionElement);
            let transactionDateTimeElement = extractDateFromTransaction(transactionElement)
            let transactionDescriptionElement = extractDescriptionFromTransaction(transactionElement);
            if (transactionAmountElement === null) {
                console.log(transactionElement);
                continue;
            }
            let amountAsString = transactionAmountElement.innerText;
            let dateAsString = transactionDateTimeElement.innerText;
            let description = transactionDescriptionElement.innerText;
            let transaction = new Transaction(dateAsString, description, amountAsString);
            transactions.push(transaction);
        }

        function printTransactionSummary(heading, transactions, filterCriteria) {
            let filteredTransactions = transactions.filter(filterCriteria);
            let totalTransactionSumAmount = sumAllTransactions(filteredTransactions);
            if (totalTransactionSumAmount === 0) return;
            console.log(heading);
            console.log("Sum of Transactions: " + totalTransactionSumAmount);
            filteredTransactions.forEach(transaction => {
                transaction.print();
            });
            console.log("====================================================================");
        }

        printTransactionSummary("Cashback Transactions: ", transactions, transaction => transaction.isCashback());

        printTransactionSummary("Amazon Pay reward Transactions: ", transactions, transaction => transaction.isAmazonPayRewardTransaction());

        printTransactionSummary("Swiggy Transactions: ", transactions, transaction => transaction.isSwiggyTransaction());

        printTransactionSummary("Zomato Transactions: ", transactions, transaction => transaction.isZomatoTransaction());

        printTransactionSummary("SmartQ Transactions: ", transactions, transaction => transaction.isSmartqTransaction());

        printTransactionSummary("Amazon vending machine Transactions: ", transactions, transaction => transaction.isAmazonVendingTransaction());

        printTransactionSummary("Instamart Transactions: ", transactions, transaction => transaction.isInstamartTransaction());

        printTransactionSummary("Blinkit Transactions: ", transactions, transaction => transaction.isBlinkitTransaction());

        printTransactionSummary("Uber Transactions: ", transactions, transaction => transaction.isUberTransaction());

        printTransactionSummary("Ola Transactions: ", transactions, transaction => transaction.isOlaTransaction());

        printTransactionSummary("Rapido Transactions: ", transactions, transaction => transaction.isRapidoTransaction());

        printTransactionSummary("QuickRide Transactions: ", transactions, transaction => transaction.isQuickRideTransaction());

        printTransactionSummary("Zomato Dining Transactions: ", transactions, transaction => transaction.isZomatoDiningTransaction());

        printTransactionSummary("Refund Transactions: ", transactions, transaction => transaction.isRefundTransaction());

        printTransactionSummary("Gift card Transactions: ", transactions, transaction => transaction.isGiftCardTransaction());

        printTransactionSummary("Wallet reload Transactions: ", transactions, transaction => transaction.isWalletReloadTransaction());

        printTransactionSummary("Auto reload Transactions: ", transactions, transaction => transaction.isAutoReloadTransaction());

        printTransactionSummary("Piped Gas Transactions: ", transactions, transaction => transaction.isPipedGasTransaction());

        printTransactionSummary("Electricity bill payment Transactions: ", transactions, transaction => transaction.isElectricityTransaction());

        printTransactionSummary("Credit card bill payment Transactions: ", transactions, transaction => transaction.isCreditCardBillPaymentTransaction() && !transaction.isCashback());

        printTransactionSummary("Mobile prepaid recharge Transactions: ", transactions, transaction => transaction.isMobileRechargeTransaction());

        printTransactionSummary("Apollo Pharmacy Transactions: ", transactions, transaction => transaction.isApolloPharmacyTransaction());

        printTransactionSummary("Insurance premium Transactions: ", transactions, transaction => transaction.isInsurancePremiumTransaction());

        printTransactionSummary("ICICI Reward Transactions: ", transactions, transaction => transaction.isICICIRewardRechargeTransaction());

        let newTypeOfTransactions = transactions
            .filter(transaction => !transaction.isCashback())
            .filter(transaction => !transaction.isSmartqTransaction())
            .filter(transaction => !transaction.isAmazonVendingTransaction())
            .filter(transaction => !transaction.isSwiggyTransaction())
            .filter(transaction => !transaction.isInstamartTransaction())
            .filter(transaction => !transaction.isZomatoTransaction())
            .filter(transaction => !transaction.isZomatoDiningTransaction())
            .filter(transaction => !transaction.isBlinkitTransaction())
            .filter(transaction => !transaction.isUberTransaction())
            .filter(transaction => !transaction.isUberReleasedTransaction())
            .filter(transaction => !transaction.isUberOnHoldTransaction())
            .filter(transaction => !transaction.isOlaTransaction())
            .filter(transaction => !transaction.isOlaReleaseTransaction())
            .filter(transaction => !transaction.isOlaOnHoldTransaction())
            .filter(transaction => !transaction.isQuickRideTransaction())
            .filter(transaction => !transaction.isApolloPharmacyTransaction())
            .filter(transaction => !transaction.isInsurancePremiumTransaction())
            .filter(transaction => !transaction.isRapidoTransaction())
            .filter(transaction => !transaction.isRefundTransaction())
            .filter(transaction => !transaction.isGiftCardTransaction())
            .filter(transaction => !transaction.isWalletReloadTransaction())
            .filter(transaction => !transaction.isAutoReloadTransaction())
            .filter(transaction => !transaction.isPipedGasTransaction())
            .filter(transaction => !transaction.isElectricityTransaction())
            .filter(transaction => !transaction.isCreditCardBillPaymentTransaction())
            .filter(transaction => !transaction.isAmazonPayRewardTransaction())
            .filter(transaction => !transaction.isICICIRewardRechargeTransaction())
            .filter(transaction => !transaction.isMobileRechargeTransaction());

        printTransactionSummary("Remaining Transactions: ", newTypeOfTransactions, transaction => transaction.bypassFilter());

    }, scriptExecutionDelay);
})();
