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
        function getTopProducts(limit = 10) {
            // Select all elements with the class name 'product-base'
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
                const productRating = ratingContainer ? parseFloat(ratingContainer.innerText) : 0; // Default to 0 if no rating
        
                // Extract the product ratings count from 'product-ratingsCount'
                const ratingsCountElement = productElement.querySelector('.product-ratingsCount');
                const rawRatingsCount = ratingsCountElement
                    ? ratingsCountElement.innerText.split('\n')[1]
                    : null;
                const productRatingsCount = rawRatingsCount
                    ? rawRatingsCount.includes('k')
                        ? parseFloat(rawRatingsCount.replace('k', '')) * 1000
                        : parseFloat(rawRatingsCount)
                    : 0; // Default to 0 if no ratings count
        
                // Extract the href from the <a> tag
                const linkElement = productElement.querySelector('a');
                const href = linkElement ? linkElement.href : null; // Default to null if no link
        
                // Build the product object
                const product = {
                    id: productId,
                    productRating: productRating,
                    productRatingsCount: productRatingsCount,
                    href: href,
                };
        
                // Add the product object to the array
                products.push(product);
            }
        
            // Sort the products based on 'productRatingsCount' in descending order
            products.sort((a, b) => b.productRatingsCount - a.productRatingsCount);
        
            // Print only the link and rating count of the top products
            products.slice(0, limit).forEach(product => {
                console.log(`${product.href}, ${product.productRatingsCount}`);
            });
        }
      


    }, scriptExecutionDelay);
})();
