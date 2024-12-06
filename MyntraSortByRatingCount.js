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
        // Get all elements with the class name 'product-ratingsCount'
        const ratingElements = document.getElementsByClassName('product-ratingsCount');
        
        // Initialize an array to store numeric ratings
        const ratings = [];
        
        // Function to convert rating strings to numbers
        function convertRatingToNumber(rating) {
            if (rating.includes('K')) {
                // Remove 'k', parse as float, and multiply by 1000
                return parseFloat(rating.replace('k', '')) * 1000;
            }
            // Convert directly to a number if no 'k'
            return parseFloat(rating);
        }
        
        // Loop through the elements and extract ratings
        for (let i = 0; i < ratingElements.length; i++) {
            // Split innerText by new line and get the second part
            const ratingString = ratingElements[i].innerText.split('\n')[1];
            // Convert the rating string to a number
            const ratingNumber = convertRatingToNumber(ratingString);
            // Add the numeric rating to the array
            ratings.push(ratingNumber);
            // Log the extracted rating to the console
            console.log(ratingNumber);
        }
        
        // Sort the numeric ratings in ascending order
        ratings.sort((a, b) => a - b);
        
        // Log the sorted array of ratings
        console.log("Sorted Ratings:", ratings);
      


    }, scriptExecutionDelay);
})();
