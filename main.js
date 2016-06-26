var gmail;

function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

function confirmSave(notification, result){
  console.log('This seems to me as: ' + result + '% positive. ');

      var answer = confirm(notification);
      if (answer){
        console.log("message undo = TRUE");
        document.getElementById('link_undo').click();
      }else{
        console.log("message undo = FALSE");
     }
};

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
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

      if(result > 50) {
        console.log('This seems to me as: ' + result + '% positive. ');
      }else{
        var notification = "Hi, this email might not leave a positive impression. Would you rather undo it, have a short break and write a friendlier email afterwards?";
        confirmSave(notification, result);
      }

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
  message = strip(message);
  message = message.replace(/["']/g, "");
  console.log('message was:', message);
  MoodyChecker(message);
});

gmail.observe.after('send_message', function(url, body, data, xhr){
  console.log("Message has been sent");
});

}

refresh(main);
