var firebaseConfig = {
    apiKey: "AIzaSyC7FPjJHiUSjbDxCcQMmAF0QJEqhGVfEXY",
    authDomain: "derived-scrolling.firebaseapp.com",
    projectId: "derived-scrolling",
    storageBucket: "derived-scrolling.appspot.com",
    messagingSenderId: "650788911924",
    appId: "1:650788911924:web:7300caa6f8332beb940361"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var storageRef = firebase.storage().ref();


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('Who got the keys to my bimma?');
        chrome.tabs.captureVisibleTab(null, {
            format: 'png'
        }, function (dataURL) {

            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = request.data.w;
                canvas.height = request.data.h;
                var context = canvas.getContext('2d');
                // Assuming px,py as starting coordinates and hx,hy be the width and the height of the image to be extracted
                context.drawImage(img, request.data.x, request.data.y, request.data.w, request.data.h, 0, 0, request.data.w, request.data.h);
                var croppedUri = canvas.toDataURL('image/png');
                firebase.storage().ref().child(Date.now() + '.png').putString(croppedUri, 'data_url').then(function (snapshot) {
                    dataURL = null;
                });
            };
            img.src = dataURL;
        }); //remember that captureVisibleTab() is a statement
        return true;
    }
);
