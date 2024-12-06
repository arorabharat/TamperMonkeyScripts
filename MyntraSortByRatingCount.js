// ==UserScript==
// @name         MyntraSortByRatingCount
// @namespace    http://tampermonkey.net/
// @version      0.1
// @descriptionription  This Script will enable you to sort product by rating count.
// @author       You
// @match        https://www.myntra.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// ==/UserScript==



(function () {
    'use strict';

    let scriptExecutionDelay = 3000; // ensure the page is fully loaded after this time

    setTimeout(function () {

        console.log("Script is working ..");
        const productElements = document.getElementsByClassName('product-base');

        // Initialize an array to store the product details
        const products = [];
        
        // Iterate over each 'product-base' element
        for (let i = 0; i < productElements.length; i++) {
            const productElement = productElements[i];
        
            // Extract the product ID from the 'id' attribute
            const productId = productElement.id;
        
            // Extract the product rating from 'product-ratingsContainer' span
            const ratingContainer = productElement.querySelector('.product-ratingsContainer span');
            const productRating = ratingContainer ? parseFloat(ratingContainer.innerText) : null;
        
            // Extract the product ratings count from 'product-ratingsCount'
            const ratingsCountElement = productElement.querySelector('.product-ratingsCount');
            const rawRatingsCount = ratingsCountElement
                ? ratingsCountElement.innerText.split('\n')[1]
                : null;
            const productRatingsCount = rawRatingsCount
                ? rawRatingsCount.includes('k')
                    ? parseFloat(rawRatingsCount.replace('k', '')) * 1000
                    : parseFloat(rawRatingsCount)
                : null;
        
            // Build the product object
            const product = {
                id: productId,
                productRating: productRating,
                productRatingsCount: productRatingsCount,
            };
        
            // Add the product object to the array
            products.push(product);
        }
      


    }, scriptExecutionDelay);
})();
