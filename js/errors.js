/*** JS file containing a class for errors.
Originally intended for the website of "Arbeid og Aktivitet, Tromsø" (by Jon Simonsen). ***/

/**class TestError extends Error{
  constructor(message, origin){**/
    /*Initialize a new error using base constructor*/
    /**super(message);
    this._origin = origin;
  }

  logToConsole(){
    console.log(`${this._origin}() error: ${this.message}`);
  }
}

export default class TestError {}**/

module.exports = {};

module.exports.TestError = class TestError extends Error{
  constructor(message, origin){
    /*Initialize a new error using base constructor*/
    super(message);
    this._origin = origin;
  }

  logToConsole(){
    console.log(`${this._origin}() error: ${this.message}`);
  }
}
