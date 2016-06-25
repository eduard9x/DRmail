var gmail;

function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

function MoodyChecker(message){
  $.ajax({
      url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
      beforeSend: function(xhrObj){
          // Request headers
          xhrObj.setRequestHeader("Content-Type","application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","64e94ab8a26a4601ae5d242ad5b59e03");
      },
      type: "POST",
      // Request body
      data: '{"documents":[{"language":"en","id":"1","text":"' + message + '"}]}',
  })
  .done(function(data) {
      var result = data.documents[0].score;
      result = parseInt(result * 1000) / 10;
      alert('This seems to me as: ' + result + '% positive');
  })
  .fail(function() {
    alert('Something went wrong. Please try again.');
  });
}

var main = function(){
  gmail = new Gmail();
  console.log('Hello,', gmail.get.user_email());

gmail.observe.before('send_message', function(url, body, data, xhr){
  var message = data.body;
	var first = '<div dir="ltr">';
  var last = '</div>';
  message = message.substring(message.lastIndexOf(first)+first.length, message.lastIndexOf(last));
  MoodyChecker(message);
});

}

refresh(main);
