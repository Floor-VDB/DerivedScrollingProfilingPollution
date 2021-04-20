function setup() {
  noCanvas();
    
  var intervalresolution = select('#intervalresolution');
  var scrollspeed = select('#scrollspeed');
  var likechance = select('#likechance');
  var waittime = select('#waittime');  
    
     var LikeSwitchValue= false;
  var LikeSwitch = select('#likeswitch');
  function FlipLikeSwitch() {
      LikeSwitchValue=!LikeSwitchValue;
  }  
  LikeSwitch.input(FlipLikeSwitch)
    
  var ScreenSwitchValue = false;
  var ScreenSwitch = select('#screenswitch');
  function FlipScreenSwitch() {
      ScreenSwitchValue=!ScreenSwitchValue;
  }
  ScreenSwitch.input(FlipScreenSwitch);
    
  var AdvertiseSwitchValue= false;
  var AdvertiseSwitch = select('#advertiseswitch');
  function FlipAdvertiseSwitch() {
      AdvertiseSwitchValue=!AdvertiseSwitchValue;
  }  
  AdvertiseSwitch.input(FlipAdvertiseSwitch)
    
  var StartSwitch = select('#startswitch');
  StartSwitch.input(sendMessage);

  // A message is sent to the content script
  function sendMessage() {
    var msg = {
      from: 'popup',
      screen: ScreenSwitchValue,
      like: LikeSwitchValue,
      advertise: AdvertiseSwitchValue,
      intervalresolution:intervalresolution,
      scrollspeed:scrollspeed,
      likechance:likechance,
      waittime:waittime
    }

    var params = {
      active: true,
      currentWindow: true
    }
    
    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    }
  }
}
