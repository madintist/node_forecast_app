////////////
//Imports //
////////////

var render = require("./renderer.js");



//////////////////
//Router Module //
//////////////////

function error404(response) {
    response.writeHead(404, {"Content-type": "text/html"});
    response.write("<h1>404 Error</h1>");
    response.write("Sorry! We were unable to find the requested address");
    response.end();
}



/**
 * Respond with a 500 error
 * @param  {http.ServerResponse} response - Node http.ServerResponse object
 * @param  {Error} error                  - Error object from Promise
 * @return {Undefined}
 */
function error500(response, error) {
    response.writeHead(500, {"Content-type": "text/html"});
    response.write("<h1>500 Error</h1>");
    response.write("<p>Sorry! We encountered the following error:<p>");
    response.write("<p>" + error.message + "</p>");
    response.end();
}



/**
* Handle app routing
* @param  {http.ClientRequest} request   - Client request
* @param  {http.ServerResponse} response - Server response
* @return {http.ServerResponse}          - response object
*/
function route(request, response) {
    var forecastRegExp = /^\/forecast(\?location\=\w*)?$/i;

    if (request.url == "/") {
        //Home page
        response.writeHead(200, {"Content-type": "text/html"});
        var home = render.render("home");
        home.then(
            function onFulfilled(view) {
                response.write(view);
                response.end();
            },
            function onRejected(error) {
                error500(response, error);
            }
        );
    }
    else if (forecastRegExp.test(request.url)) {
        //Forecast page
        response.writeHead(200, {"Content-type": "text/html"});

        var locationRegExp = /location=\d{5}$/i,
            forecast;

        //Validate ZIP code:
        if(locationRegExp.test(request.url)) {
            forecast = render.render("forecast");
        } else {
            forecast = render.render("error", {errorMessage: "Please enter a valid 5 digit ZIP code."});
        }

        forecast.then(
            function onFulfilled(view) {
                response.write(view);
                response.end();
            },
            function onRejected(error) {
                error500(response, error);
            }
        );
    }
    else if (request.url == "/css/main.css") {
        //CSS Files
        response.writeHead(200, {"Content-type": "text/css"});
        var css = render.css;
        css.then(
            function onFulfilled(cssFile) {
                response.write(cssFile);
                response.end();
            },
            function onRejected(error) {
                error500(response, error);
            }
        );
    }
    else {
        error404(response);
    }
}


///////////////////
//Module Exports //
///////////////////

module.exports.route = route;
