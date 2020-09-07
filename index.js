/*
 * Name: Aaron Tsang
 * Date: May 6, 2020
 * Section: CSE 154 AL
 *
 * This class handles the buttons, API calls, and error catches for CP3's
 * index.html class.
 */

'use strict';
(function() {
  const URL = "http://api.icndb.com/jokes/random/?escape=javascript&";
  window.addEventListener('load', init);

  /** Loads all the necessary functions after the DOM is created */
  function init() {
    qs('form').addEventListener("submit", function(e) {
      e.preventDefault();
      let numJokes = id("num-jokes")[id("num-jokes").selectedIndex].textContent;
      for (let index = 0; index < numJokes; index++) {
        genJoke();
      }
      id('clear-btn').classList.remove("hidden");
    });
    id('clear-btn').addEventListener('click', () => {
      id('joke-box').innerHTML = '';
      id('clear-btn').classList.add("hidden");
    });
  }

  /** Submits the filtered information for jokes to the server */
  function genJoke() {
    fetch(URL + getParams())
      .then(checkStatus)
      .then(resp => resp.json())
      .then(handleResponse)
      .catch(handleError);
  }

  /**
   * Takes in the parameters specified by the user and returns the parameters
   * as query parameters
   *
   * @return {String} - the query parameters specified by the user
   */
  function getParams() {
    let firstName = id("first-name").value.trim();
    let lastName = id("last-name").value.trim();
    let params = "limitTo=[" + id("joke-type")[id("joke-type").selectedIndex].value + "]";
    let fullname = "";
    if (firstName !== "" || lastName !== "") {
      fullname = "firstName=" + firstName + "&lastName=" + lastName;
      params = fullname + "&" + params;
    }
    return params;
  }

  /**
   * Take in the JSON object from the server and retrieves the joke
   *
   * @param {object} response - the object returned from the server, in JSON form
   */
  function handleResponse(response) {
    let joke = JSON.stringify(response.value.joke);
    let divider = gen("hr");
    let content = gen("p");
    content.textContent = joke;
    id('joke-box').appendChild(content);
    id('joke-box').appendChild(divider);
  }

  /**
   * Displays error message for the user while disabling buttons and joke generator
   *
   * @param {Promise} error - a rejected Promise result
   */
  function handleError(error) {
    let errorMessage = gen("p");
    errorMessage.id = "errorMess";
    errorMessage.textContent = "ERROR :( -" + error +
    ". Please check fetch request, API response format, and refresh page";
    qs('button').disabled = true;
    id('first-name').disabled = true;
    id('last-name').disabled = true;
    id('clear-btn').classList.add("hidden");
    id('joke-type').disabled = true;
    id('num-jokes').disabled = true;
    id('joke-box').innerHTML = '';
    qs('body').appendChild(errorMessage);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw Error("Error in request: " + response.statusText);
    }
  }

  /**
   * shortens the way to select an element by its ID
   * @param {string} idName - the ID of the selected element
   * @return {DOMObject} - the DOMObject with the corresponding ID
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * shortens the way to select an element by its selector
   * @param {string} selector - the selector of the indicated element(s)
   * @return {DOMObject} - the DOMObject(s) with the corresponding selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * shortens the way to create an element
   * @param {string} elType - the element type of the desired DOMObject to be created
   * @return {DOMObject} - the DOMObject that was created per the parameter
   */
  function gen(elType) {
    return document.createElement(elType);
  }

})();
