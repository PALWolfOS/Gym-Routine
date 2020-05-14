var express = require('express'),
    googleapis = require('googleapis'),
    app = express(),
    youtubeClient = null,  
    staticFolder = '/public',  //The folder, inside the server, where the static content is stored.
    /** The system port used by the server 
      * On hosts like Heroku, you'll need to use the one set by the environment
      * on default, instead, we choose port 8080.
      */
    port = process.env.PORT || 8080,
    /** @property VALID_ORDER_CRITERIA
      * @private
      * 
      * A list of the admissable values for the "order" parameter in YouTube video searches.
      */
    VALID_ORDER_CRITERIA = ['date', 'rating', 'relevance', 'title', 'videoCount', 'viewCount'],
    DEFAULT_MAX_RESULTS = 5,
    PAGE_SIZE = 50,
    API_KEY = 'AIzaSyBjFrPj_MhxWD_ZUIdlFtk09MNjcOzpCyo';                                      

app.configure(function(){
  app.use('/', express.static(__dirname + staticFolder));
});




/** @function validatePositiveNumber
  * Validate a value, ensuring it is a positive integer, 
  * and returning a default value (that MUST me passed by the caller), if the validation fails.
  * 
  * @param {Number} value   The value that needs to be validated.
  * @param {Number} defaultValue  The value to be returned when validation fails for value.
  * 
  * @return {Number} Either value (possibly converted to a numeric format), if it passes validation, or defaultValue;
  *         It should be returned a positive integer, assuming defaultValue is coherent with the function requirements.
  */
function validatePositiveNumber (value, defaultValue) {
  value = Number(value);
  if (isNaN(value) || value <= 0) {
    return defaultValue;
  }
  else {
    return value;
  }
}

/** @function validateOrderParameter
  * Validate a value, ensuring it is a valid option for the 'order' field of the parameters for the DATA API's search method, 
  * and returning a default value (that MAY me passed by the caller), if the validation fails.
  * 
  * @param {String} value   The value that needs to be validated.
  * @param {String|undefined} [defaultValue]  The value to be returned when validation fails for value.
  * 
  * @return {String|undefined} Either value, if it passes validation, or defaultValue;
  */
function validateOrderParameter (value, defaultValue) {
  if (VALID_ORDER_CRITERIA.indexOf(value) >= 0) {
    return value;
  } else {
    return defaultValue;
  }
}

/** @function search
  * @private
  *
  * Perform the actual search
  * 
  * @param {Object} options   The collection of properties to be set as parameter for the DAta API's search method.
  * @param {Number} firstResult  The value to be returned when validation fails for value.
  * @param {Funciton} onError  The callback to execute in case of errors.
  * @param {Function} onSuccess  The callback to be invoked when YouTube's API returns correctly the results of the search.
  * 
  * @return {undefined}
  */
function search (options, firstResult, onError, onSuccess) {
  var paramName, 
      paramValue,
      i, n,
      items, 
      results = [],
      params = { 
        part: "id,snippet",
        type: "video"
      }
      maxResults = options.maxResults,
      lastPage = Math.floor((firstResult + maxResults - 1) / PAGE_SIZE),    //video indexes start from 0, so we have to subtract 1
 
      /** @function collectResultsUpToLastPage
        * 
        * If remainingPages is positive, then collects the query results for a single page, and then recursively calls itself;
        * if, instead, remainingPages is zero, it means that the results have been loaded up to the second-last page 
        * (or that the last page ofresults is also the first, i.e. all the results we need to download are in thefirst page).
        * If download fails, calls the onError function and break the flow of execution.
        *
        * @param {Number} remainingPages  How many pages of results are needed before the last page.
        * @return {undefined}
        */
      collectResultsUpToLastPage = function (remainingPages) {
        if (!remainingPages) {
            doSearch();
        } else {
            params.maxResults = PAGE_SIZE;
            youtubeClient.youtube
                            .search
                              .list(params)
                              .withApiKey(API_KEY)
                              .execute(function (err, response) {
                                if (err) {
                                  onError(err, response);
                                } else {
                                  items = response.items;
                                  n = items.length;
                                  for (i = 0; i < n; i++) {
                                    results.push(items[i]);
                                  }
                                  
                                  params.pageToken = response.nextPageToken;
                                  collectResultsUpToLastPage(remainingPages - 1);
                                }
                              });          
        }
      },
      /** @function doSearch
        * 
        * Download the last page of results, and then, if no error is found, calls the onSuccess callback passing the slice of results
        * between firstResult and firstResult + maxResults.
        *
        * @return {undefined}
        */      
      doSearch = function () {
        params.maxResults = (firstResult + maxResults) % PAGE_SIZE || PAGE_SIZE;  //if n % PAGE_SIZE == 0, then we need to get PAGE_SIZE results from the last page
        youtubeClient.youtube
                        .search
                          .list(params)
                          .withApiKey(API_KEY)
                          .execute(function (err, response) {
                            if (err) {
                              onError(err, response);
                            } else {
                              items = response.items;
                              n = items.length;
                              for (i = 0; i < n; i++) {
                                results.push(items[i]);
                              }
                              onSuccess(results.slice(firstResult, firstResult + maxResults));
                            }
                          });
        
      }

  //Copies the parameters set by the user to the object that will be passed to YouTube API
  for (paramName in options) {
    paramValue = options[paramName];
    if (typeof paramValue !== "undefined") {
      params[paramName] = paramValue;
    }
  }

  //Starts the search
  collectResultsUpToLastPage(lastPage);
}


/** @function parseData 
  * Return a subset of the data, filtering out all the fields we are not going to use.
  * 
  * @param {Array} data   The array containing the video items returned by YouTube APIs
  * 
  * @return {Array} The array
  */
function parseData (data) {
  return data.map(function (d) {
                    var id = d.id,
                        snippet = d.snippet;
                    return {
                      id: id && id.videoId,
                      title: snippet && snippet.title,
                      thumb: snippet && snippet.thumbnails.default.url,
                      date: snippet && snippet.publishedAt
                    };
                  });
}

/** @function route
  * Called when a valid paths is browsed through GET http methofd, extracts the parameters from the URL path and the 
  * get parameters, defines the calllback that will handle successfull calls and errors, and hands everything over to
  * the search function, which in turn will use the YouTube DATA API.
  * 
  * @param {Object} req   A wrapper for the request object, through which we can access the request parameters.
  * @param {Object} res   A wrapper for the response object, allowing us to send back errors or results to the browser.
  * 
  * @return {undefined}
  */
function route (req, res) {

  var keywords = req.params.keywords,
      onError = function (err, response) {
        res.status(404).send(err);
      },
      onSuccess = function (data) {
        res.status(302).send(parseData(data));
      };

  if(!keywords) {
    res.statusCode = 400;
    return res.redirect('/');
  }

  search({
            q: keywords,
            regionCode: req.params.country, 
            relatedToVideoId: req.params.relatedId,
            order: validateOrderParameter(req.query.order, undefined),
            maxResults: validatePositiveNumber(req.query.max_results, DEFAULT_MAX_RESULTS)
          },
          validatePositiveNumber(req.query.first_result, 1),
          onError,
          onSuccess);
}

app.get('/videos/:keywords', function(req, res) {
    return route(req, res);
});

app.get('/videos/:keywords/countries/:country', function(req, res) {
    return route(req, res);
});

app.get('/videos/:keywords/related/:relatedId', function(req, res) {
    return route(req, res);
});

googleapis.discover('youtube', 'v3').execute(function (err, client) {
  if (err) {
    console.log("Unable to connect to YoutubeApi: " + err);
    //Shut down server
    app.close();
    return ;
  } else {
    youtubeClient = client;

    app.listen(port);
    console.log("Listening to port: " + port);
  }
});
