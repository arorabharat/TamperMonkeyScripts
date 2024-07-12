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

    isSwiggyTransaction() {
        return this.description.toLowerCase().includes('paid on swiggy');
    }

    isUberTransaction() {
        return this.description.toLowerCase().includes('paid on uber india');
    }

    isSmartqTransaction() {
        return this.description.toLowerCase().includes('paid on smartq');
    }

    isRefundTransaction() {
        return this.description.toLowerCase().includes('refund');
    }

    isGiftCardTransaction() {
        return this.description.toLowerCase().includes('added amazon pay gift card');
    }

    isElectricityTransaction() {
        return this.description.toLowerCase().includes('electricity bill payment');
    }

    isPipedGasTransaction() {
        return this.description.toLowerCase().includes('piped gas payment');
    }

    isUberOnHoldTransaction() {
        return this.description.toLowerCase().includes('on-hold for uber india');
    }

    isUberReleasedTransaction() {
        return this.description.toLowerCase().includes('released from uber india');
    }

    isCreditCardBillPaymentTransaction() {
        return this.description.toLowerCase().includes('credit card bill payment');
    }

    isAmazonPayRewardTransaction() {
        return this.description.toLowerCase().includes('rewards earned for last billing cycle');
    }

    isMobileRechargeTransaction() {
        return this.description.toLowerCase().includes('mobile prepaid recharge');
    }

    bypassFilter() {
        return true;
    }

}

(function () {
    'use strict';

    let scriptExecutionDelay = 30000; // ensure the page is fully loaded after this time

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

            let dateAsString = transactionDateTimeElement.innerText;
            let amountAsString = transactionAmountElement.innerText;
            let description = transactionDescriptionElement.innerText;
            let transaction = new Transaction(dateAsString, description, amountAsString);
            transactions.push(transaction);
        }

        function printTransactionSummary(transactions, filterCriteria) {
            let filteredTransactions = transactions.filter(filterCriteria);
            let totalCashbackAmount = sumAllTransactions(filteredTransactions);
            console.log("Sum of Transactions: " + totalCashbackAmount);
            filteredTransactions.forEach(transaction => {
                transaction.print();
            });
            console.log("====================================================================");
        }

        console.log("Cashback Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isCashback());

        console.log("Swiggy Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isSwiggyTransaction());

        console.log("Zomato Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isZomatoTransaction());

        console.log("Blinkit Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isBlinkitTransaction());

        console.log("SmartQ Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isSmartqTransaction());

        console.log("Uber Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isUberTransaction());

        console.log("Refund Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isRefundTransaction());

        console.log("Gift card Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isGiftCardTransaction());

        console.log("Piped Gas Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isPipedGasTransaction());

        console.log("Electricity bill payment Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isElectricityTransaction());

        console.log("Credit card bill payment Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isCreditCardBillPaymentTransaction() && !transaction.isCashback());

        console.log("Amazon Pay reward Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isAmazonPayRewardTransaction());

        console.log("Mobile prepaid recharge Transactions: ");
        printTransactionSummary(transactions, transaction => transaction.isMobileRechargeTransaction());

        let newTypeOfTransactions = transactions
            .filter(transaction => !transaction.isCashback())
            .filter(transaction => !transaction.isSmartqTransaction())
            .filter(transaction => !transaction.isSwiggyTransaction())
            .filter(transaction => !transaction.isZomatoTransaction())
            .filter(transaction => !transaction.isBlinkitTransaction())
            .filter(transaction => !transaction.isSmartqTransaction())
            .filter(transaction => !transaction.isUberTransaction())
            .filter(transaction => !transaction.isRefundTransaction())
            .filter(transaction => !transaction.isGiftCardTransaction())
            .filter(transaction => !transaction.isPipedGasTransaction())
            .filter(transaction => !transaction.isElectricityTransaction())
            .filter(transaction => !transaction.isCreditCardBillPaymentTransaction())
            .filter(transaction => !transaction.isUberReleasedTransaction())
            .filter(transaction => !transaction.isUberOnHoldTransaction())
            .filter(transaction => !transaction.isAmazonPayRewardTransaction())
            .filter(transaction => !transaction.isMobileRechargeTransaction());

        console.log("Remaining Transactions: ");
        printTransactionSummary(newTypeOfTransactions, transaction => transaction.bypassFilter());

    }, scriptExecutionDelay);
})();
