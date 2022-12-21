function mainFunction() 
{
  clearRecords();

  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var tableSheet = ss.getSheetByName("TABLE");
  var settingsSheet = ss.getSheetByName("SETTINGS");
  var searchValue = tableSheet.getRange(1,2).getValue();
  var api_key = settingsSheet.getRange(1,2).getValue();

  var url = "http://api.scraperapi.com";
  url += "?api_key="+api_key;
  url += "&autoparse=true";
  url += "&url=https://www.amazon.com/s?k="+searchValue;

  Logger.log('url: ' + url);

  //CALL API
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);

  Logger.log('content: ' + data);
  Logger.log('results: ' + data.results.length);

  var item_count = 1;

  for (var i = 0; i < data.results.length; i++) 
  {
    var results = data.results;
    var name = results[i].name;        
    var image = results[i].image;
    var list_url = results[i].url;
    var stars = results[i].stars;
    var price = results[i].price;
    var reviews = results[i].total_reviews;

    if(stars == null)
    {
      stars = 0;
    }

    if(reviews == null)
    {
      reviews = 0;
    }

    addRecord(item_count, 1, name, image, list_url, stars, reviews, price);

    item_count++;
  }

  var pages = data.pagination;

  if(pages.length > 0)
  {
    for (var x = 0; x < pages.length; x++) 
    {
      Utilities.sleep(5000);

      var url = "http://api.scraperapi.com";
      url += "?api_key="+api_key;
      url += "&autoparse=true";
      url += "&url="+pages[x];

      //CALL API
      var response = UrlFetchApp.fetch(url);
      var json = response.getContentText();
      var data = JSON.parse(json);

      for (var i = 0; i < data.results.length; i++) 
      {
        var results = data.results;
        var name = results[i].name;        
        var image = results[i].image;
        var list_url = results[i].url;
        var stars = results[i].stars;
        var price = results[i].price;
        var reviews = results[i].total_reviews;

        if(stars == null)
        {
          stars = 0;
        }

        if(reviews == null)
        {
          reviews = 0;
        }

        addRecord(item_count, x+2, name, image, list_url, stars, reviews, price);

        item_count++;
      }

    }
  }
}

function clearRecords()
{
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var tableSheet = ss.getSheetByName("TABLE");
  tableSheet.getRange("A4:H1000").clear();
}

function addRecord(count, page, name, image, list_url, stars, reviews, price) {
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var tableSheet = ss.getSheetByName("TABLE");
  tableSheet.appendRow([count,
                      page, 
                      name, 
                      image, 
                      list_url, 
                      stars,
                      reviews, 
                      price]);
}