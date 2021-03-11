// Derived Scrolling
// A pinch of random, a touch of chaos, because statism and identity is for amateurs.
// Ink stains are my favorite kind of black.

console.log("Derived scrolling is running, yee-haw! This is popup.html console");

//init
var Started = false;
var i = 0;
var ScrollingDown = true;
var ScrollingUp = false;
var Liking = false;
var Waiting = false;
var LikedSomethingWhileWaiting = false;
var NavBarYHeight = 56;
chrome.runtime.onMessage.addListener(receiver);


//settings
//  scrolling
var TimeResolution = 30;
var ScrollPixelsPerSecond = 800;
var ScrollResolution = ScrollPixelsPerSecond / TimeResolution;
var IntervalIterator = 0;

//  Functions while scrolling
var StopScrollDownChance = 0.025;
var ScrollUpAfterScrollDownChance = 0.15;

var StopScrollUpChance = 0.1;
var ScrollDownAfterScrollUpChance = 0.2;

var StopWaitChance = 0.005;
var LikeChance = 0.3;
var LikeAblePostATMrect;

var MinIntervalsOnAction = 40;



function SendScreenToServer() {

    if (LikeAblePostATMrect == null) {
        console.log("Wanted to screenshot but there was no likeable post");
    } else {
        
        chrome.runtime.sendMessage({
            msg: "capture",
            data: {
                x: LikeAblePostATMrect.x,
                y: LikeAblePostATMrect.y,
                w: LikeAblePostATMrect.width,
                h: LikeAblePostATMrect.height
            }
        });

        console.log("screened the thing with top:" + LikeAblePostATMrect.top);
        
    }
}

function LikePost() {

    var LikeAblePosts = document.querySelectorAll('[data-pagelet="FeedUnit_{n}"]');
    console.log("The posts we can like are: " + LikeAblePosts);



    for (i = 0; i < LikeAblePosts.length; i++) {
        var rect = LikeAblePosts[i].getBoundingClientRect();

        if (rect.top > -150 && rect.top < document.documentElement.clientHeight * 0.5) {

            //align post with top of page

            window.scrollBy(0, rect.top - NavBarYHeight);

            //LOOK FOR LIKE BUTTON WITHIN POST
            var Likebutton = LikeAblePosts[i].querySelector('[aria-label="Like"]');
            console.log("The button we might like is this likkle thingey here:" + Likebutton);



            //IF LIKE BUTTON IS FOUND WITHIN POST do this:
            if (Likebutton == null) {
                console.log("Oh no, oh no; no like button to be found within the post. RIP in Pepperoni's LikePost()-function ");
                LikeAblePostATMrect = null;
                break;
            } else {


                var LikeAblePostATM = LikeAblePosts[i];
                LikeAblePostATMrect = LikeAblePostATM.getBoundingClientRect();

                console.log("The top of rect of the post containing the like should be this:" + LikeAblePostATMrect.top);

                Likebutton.click();
                console.log("We did it boys, we clicked a like, wowzies. Pat your computer on the back now.");
                break;

            }

        }

    }
}

function receiver(request, sender, sendResponse) {
   //TimeResolution =  request.intervalresolution;
   //ScrollPixelsPerSecond=request.scrollspeed;
   //LikeChance=request.likechance;
   //StopWaitChance=request.waittime;
    
    
    
    
    var intervalVar;
    Started = !Started
    console.log("Fuel the fire boys, yee-haw");
    console.log("Screenshotting: " + request.screen + " Liking: " + request.like + " Started: " + Started + " Interval: " + IntervalIterator);

    intervalVar = setInterval(function () {
        if (Started == true) {

            if (ScrollingDown == true) {
                window.scrollBy(0, ScrollResolution);
                if (Math.random() < StopScrollDownChance && IntervalIterator > MinIntervalsOnAction) {
                    if (Math.random() < ScrollUpAfterScrollDownChance) {
                        ScrollingDown = false;
                        ScrollingUp = true;
                        Waiting = false;
                        IntervalIterator = 0;
                    } else {
                        ScrollingDown = false;
                        ScrollingUp = false;
                        Waiting = true;
                        IntervalIterator = 0;
                    }
                }
            }

            if (ScrollingUp == true) {
                window.scrollBy(0, -ScrollResolution);
                if (Math.random() < StopScrollUpChance && IntervalIterator > MinIntervalsOnAction) {
                    if (Math.random() < ScrollDownAfterScrollUpChance) {
                        ScrollingDown = true;
                        ScrollingUp = false;
                        Waiting = false;
                        IntervalIterator = 0;
                    } else {
                        ScrollingDown = false;
                        ScrollingUp = false;
                        Waiting = true;
                        IntervalIterator = 0;
                    }
                }
            }

            if (Waiting == true) {
                console.log("Waiting now; liking = " + request.like + " Screenshotting = " + request.screen);
                if (request.like == true && LikedSomethingWhileWaiting == false) {
                    if (Math.random() < LikeChance) {
                        console.log("Fire the Like function: KaBoom");
                        LikePost();
                        LikedSomethingWhileWaiting = true;

                    }
                }
                if (request.screen == true && LikedSomethingWhileWaiting == true && IntervalIterator == 39) {
                        console.log("Fire the screenshotting function: Ka-Pow");
                        SendScreenToServer();
                }

                if (Math.random() < StopWaitChance && IntervalIterator > MinIntervalsOnAction) {
                    if (Math.random() < 0.8) {
                        ScrollingDown = true;
                        ScrollingUp = false;
                        Waiting = false;
                        LikedSomethingWhileWaiting = false;
                        IntervalIterator = 0;
                    } else {
                        ScrollingDown = false;
                        ScrollingUp = true;
                        Waiting = false;
                        LikedSomethingWhileWaiting = false;
                        IntervalIterator = 0;
                    }
                }
            }
        }
        if (Started == false) clearInterval(intervalVar);
        IntervalIterator++;
    }, TimeResolution);
}
