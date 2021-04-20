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
var AriaLikeName;
var AriaCommentName;

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
var LikeChance = 0.5;
var LikeAblePostATMrect;

var MinIntervalsOnAction = 50;



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
function CommentPost() {
    console.log("commentattempt");
     var CommentAblePosts = document.querySelectorAll('[data-pagelet="FeedUnit_{n}"]');
    console.log("The posts we can Comment are: " + CommentAblePosts);



    for (i = 0; i < CommentAblePosts.length; i++) {
        var rect = CommentAblePosts[i].getBoundingClientRect();

        if (rect.top > -150 && rect.top < document.documentElement.clientHeight * 0.5) {

            //align post with top of page

            window.scrollBy(0, rect.top - NavBarYHeight);

            //LOOK FOR LIKE BUTTON WITHIN POST
            if ($('html').attr('lang') == 'en') {
                console.log("Detected language: en : Like : Comment");
                var AriaLikeName = 'Like';
                var AriaCommentName = 'Leave a comment';
            };
            if ($('html').attr('lang') == 'fr') {
                console.log("Detected language: fr : J'aime : Commenter");
                var AriaLikeName = 'J’aime';
                var AriaCommentName = 'Commenter';
            };
            if ($('html').attr('lang') == 'nl') {
                console.log("Detected language: nl : 'Vind ik leuk' : 'reageren'");
                var AriaLikeName = 'Vind ik leuk';
                var AriaCommentName = 'Reageren';

            };
            var Commentbutton = CommentAblePosts[i].querySelector('[aria-label="' + AriaCommentName + '"]');
            



            //IF LIKE BUTTON IS FOUND WITHIN POST do this:
            if (Commentbutton == null) {
                console.log("No Comment button in post");
                CommentAblePostATMrect = null;
                break;
            } else {
                console.log("The button we might Comment is this:" + Commentbutton);

                var CommentAblePostATM = CommentAblePosts[i];
                CommentAblePostATMrect = CommentAblePostATM.getBoundingClientRect();


                Commentbutton.click();
                console.log("We Commented something");
                break;
                
            }

        }else{
            console.log("those posts like, totally, not in the zone, man.");
        }
        
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
            if ($('html').attr('lang') == 'en') {
                console.log("Detected language: en : Like : Comment");
                var AriaLikeName = 'Like';
                var AriaCommentName = 'Comment';
            };
            if ($('html').attr('lang') == 'fr') {
                console.log("Detected language: fr : J'aime : Commenter");
                var AriaLikeName = 'J’aime';
                var AriaCommentName = 'Commenter';
            };
            if ($('html').attr('lang') == 'nl') {
                console.log("Detected language: nl : 'Vind ik leuk' : 'reageren'");
                var AriaLikeName = 'Vind ik leuk';
                var AriaCommentName = 'Reageren';

            };
            var Likebutton = LikeAblePosts[i].querySelector('[aria-label="' + AriaLikeName + '"]');
            



            //IF LIKE BUTTON IS FOUND WITHIN POST do this:
            if (Likebutton == null) {
                console.log("No like button in post");
                LikeAblePostATMrect = null;
                break;
            } else {
                console.log("The button we might like is this:" + Likebutton);

                var LikeAblePostATM = LikeAblePosts[i];
                LikeAblePostATMrect = LikeAblePostATM.getBoundingClientRect();


                Likebutton.click();
                console.log("We liked something");
                break;
                
            }

        }else{
            console.log("those posts like, totally, not in the zone, man.");
        }
        
    }
}

function receiver(request, sender, sendResponse) {
    //INITIALIZE
    if ($('html').attr('lang') != 'en' && $('html').attr('lang') != 'nl' && $('html').attr('lang') != 'fr') {

        alert("The extension currently only detects like- and comment-buttons in English (US), Nederlands (België) & Francais (France). To make the extension work properly set facebook display language to one of them in 'Settings>Language'. \n\n The extension will start without like- and comment-functions now!");
    };
    var intervalVar;
    Started = !Started
    console.log("Fuel the fire boys, yee-haw");
    console.log("Screenshotting: " + request.screen + " Liking: " + request.like + " Advertising: " + request.advertise + " Started: " + Started + " Interval: " + IntervalIterator + " LikeChance: " + LikeChance);


    
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
                console.log("Waiting : liking = " + request.like + " Screenshotting = " + request.screen);
                if (request.like == true && LikedSomethingWhileWaiting == false) {
                    if (Math.random() < LikeChance) {
                        console.log("Like function activated.");
                        LikePost();
                        LikedSomethingWhileWaiting = true;
                        if(request.advertise == true && Math.random()>0.1){
                            CommentPost();
                        }else{
                            console.log("randomly not commenting");
                        }
                        
                    }
                }
                if (request.screen == true && LikedSomethingWhileWaiting == true && IntervalIterator == 49) {
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
