module.exports = function(app) {

	var returnJSONResults = function(baseName, queryName) {
	    //var XMLPath = "/home/hpsgn00008/dev/labs/hellopay/jira-issue-printer/helloPay-Issue-Printer/app/jira-issues.xml";

	var XMLPath = require('path').resolve(__dirname, 'jira-issues.xml');

	    var rawJSON = loadXMLDoc(XMLPath);

	    function loadXMLDoc(filePath) {
	        var fs = require('fs');
	        var xml2js = require('xml2js');
	        var json;
	        try {
	            var fileData = fs.readFileSync(filePath, 'ascii');

	            var parser = new xml2js.Parser();
	            parser.parseString(fileData.substring(0, fileData.length), function(err, result) {
	                json = JSON.stringify(result);
	                //console.log(JSON.stringify(result));
	            });

	            //console.log("File '" + filePath + "/ was successfully read.\n");
	            return json;
	        } catch (ex) {
	            console.log(ex)
	        }
	    }

	    return rawJSON;
	};

	app.get('/api/jira-issues', function(req, res){
		var result = returnJSONResults();
		var issues = JSON.parse(result).rss.channel[0].item;
		
		var response = {issues: []};

		for (var i = issues.length - 1; i >= 0; i--) {
			var issue = issues[i];
			var title = issue.title[0];
			var storyPoint = 0;
			var customFields = issue.customfields[0].customfield;
			for (var j = customFields.length - 1; j >= 0; j--) {
				var customField = customFields[j];
				
				if (customField.customfieldname[0] == "Story Points") {
					storyPoint = customField.customfieldvalues[0].customfieldvalue;
					break;
				}
			};
			response.issues.push({
				title: title,
				point: storyPoint
			});
		};

		// Disable caching for content files
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);

		res.contentType('application/json');
		res.status(200).json(response);
	});

	// application -------------------------------------------------------------
	app.get('/', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	app.get('/jira-issues', function(req, res) {
		
		// Disable caching for content files
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);

		res.sendfile('./public/jira-issue.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
