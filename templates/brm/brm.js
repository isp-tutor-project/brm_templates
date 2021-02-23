/*global db */
// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyD7zIk-8V20QqJNSs0cAV0uNL3qjeqLMdM",
    authDomain: "isptutor.firebaseapp.com",
    projectId: "isptutor"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

// these are set when you register/login so that other pages can access/manipulate student data in firebase
let collectionID = localStorage.getItem("collectionID");
let userID = localStorage.getItem("userID");

// controls research question text
let rq = "Does the water temperature affect the weight of crystal growth on a string in water after two weeks?";
if (localStorage.getItem("isptutor_rq") != undefined) {
    rq = localStorage.getItem("isptutor_rq");
}
const rqDiv = document.getElementById("research-question");
if (rqDiv) {
    rqDiv.innerHTML = rq;
}

function dumpBrmHistory() {
    // now a no-op if collectionID and/or userID are unknown
    if (collectionID !== null && userID !== null) {
        db.collection(collectionID).doc(userID).get().then((doc) => {
            let data = doc.data();
            let brmStr = data.brm || "[]";
            let brmHistory = JSON.parse(brmStr);
            console.log(JSON.stringify(brmHistory, null, 4));
        })
        .catch(function(error) {
            console.error(error);
        });
    }
}

function logEntry(entry) {
    // now a no-op if the collectionID and/or userID are unknown
    // allows non-experiment users to browse the site
    if(collectionID !== null && userID !== null) {
        db.collection(collectionID).doc(userID).get()
        .then((doc) => {
            if (doc.exists) {
                console.log("document exists.");
                let data = doc.data();
                let brmStr = data.brm || "[]";
                let brmHistory = JSON.parse(brmStr);
                brmHistory.push(entry);
                db.collection(collectionID).doc(userID).update({
                        brm: JSON.stringify(brmHistory)
                    })
                    .then(() => {
                        console.log('brm history updated in firebase');
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            } else {
                console.log("document does not exist");
            }
        })
        .catch(function (error) {
            console.error(error);
        });
    }
}

logEntry({
    type: "LINK",
    link: location.href
});

// quiz choice control
let quizChoices = document.getElementsByClassName("quiz_choice");
for (let quiz of quizChoices) {
    quiz.addEventListener("submit", e => {
        e.preventDefault();
        let formData = new FormData(quiz);
        let feedbackCorrect = quiz.querySelector(".feedback-correct");
        let feedbackIncorrect = quiz.querySelector(".feedback-incorrect");
        feedbackCorrect.style.display = "none";
        feedbackIncorrect.style.display = "none";
        if (formData.get("question") == "correct") {
            feedbackCorrect.style.display = "block";
        }
        else if (formData.get("question") == "incorrect") {
            feedbackIncorrect.style.display = "block";
        }
        // else no choice selected, so ignore everything
        else {
            return;
        }
        let choices = quiz.querySelectorAll("input");
        let labels = quiz.querySelectorAll(".label");
        if (choices.length != labels.length) {
            console.error("The number of input elements should match the number of label elements!");
        }
        let selected = "";
        for (let i = 0; i < choices.length; i++) {
            let choice = choices[i];
            if (choice.checked) {
                selected = labels[i].innerHTML;
                break;
            }
        }
        let quizEntry = {
            type: "QUIZ",
            title: quiz.querySelector("b").innerHTML,
            selected: selected,
            isCorrect: (formData.get("question") == "correct")
        }
        console.log(quizEntry);
        //logQuizEntry(quizEntry);
        logEntry(quizEntry);

    });
}
// quiz checkbox control
let quizCheckboxes = document.getElementsByClassName("quiz_checkbox");
for (let quiz of quizCheckboxes) {
    quiz.addEventListener("submit", e => {
        e.preventDefault();
        let feedbackCorrect = quiz.querySelector(".feedback-correct");
        let feedbackIncorrect = quiz.querySelector(".feedback-incorrect");
        feedbackCorrect.style.display = "none";
        feedbackIncorrect.style.display = "none";
        let correctness = true;
        let choices = quiz.querySelectorAll("input");
        for (let choice of choices) {
            if ((choice.checked && choice.value == "incorrect") || (!choice.checked && choice.value == "correct")) {
                correctness = false;
                break;
            }
        }
        if (correctness) {
            feedbackCorrect.style.display = "block";
        }
        else {
            feedbackIncorrect.style.display = "block";
        }
        let labels = quiz.querySelectorAll(".label");
        if (choices.length != labels.length) {
            console.error("The number of input elements should match the number of label elements!");
        }
        let selected = "";
        for (let i = 0; i < choices.length; i++) {
            let choice = choices[i];
            if (choice.checked) {
                selected += labels[i].innerHTML + "; ";
            }
        }
        let quizEntry = {
            type: "QUIZ",
            title: quiz.querySelector("b").innerHTML,
            selected: selected,
            isCorrect: correctness
        }
        console.log(quizEntry);
        logEntry(quizEntry);
    });
}
// quiz open control
let quizOpens = document.getElementsByClassName("quiz_open");
for (let quiz of quizOpens) {
    quiz.addEventListener("submit", e => {
        e.preventDefault();
        let feedbackCorrect = quiz.querySelector(".feedback-correct");
        feedbackCorrect.style.display = "block";
        let quizEntry = {
            type: "QUIZ",
            title: quiz.querySelector("b").innerHTML,
            selected: quiz.querySelector("textarea").value,
            isCorrect: true
        }
        console.log(quizEntry);
        logEntry(quizEntry);
    });
}
// quiz grid control
let quizGrids = document.getElementsByClassName("quiz_grid");
for (let quiz of quizGrids) {
    quiz.addEventListener("submit", e => {
        e.preventDefault();
        let formData = new FormData(quiz);
        let feedbackCorrect = quiz.querySelector(".feedback-correct");
        let feedbackIncorrect = quiz.querySelector(".feedback-incorrect");
        feedbackCorrect.style.display = "none";
        feedbackIncorrect.style.display = "none";
        let selected = "";
        let isCorrect = true;
        for (let pair of formData.entries()) {
            selected += pair[0]+":"+pair[1]+";";
            if (pair[1] == "incorrect") isCorrect = false;
        }
        if (isCorrect) {
            feedbackCorrect.style.display = "block";
        }
        else {
            feedbackIncorrect.style.display = "block";
        }
        let quizEntry = {
            type: "QUIZ",
            title: quiz.querySelector("b").innerHTML,
            selected: selected,
            isCorrect: isCorrect
        }
        console.log(quizEntry);
        logEntry(quizEntry);
    });
}


//this is for brm reminder image,
let overlay = document.createElement("div");
overlay.id = "brm-reminder-overlay";
let box = document.createElement("div");
box.id = "brm-reminder-box";
let image = document.createElement("img");
image.id = "brm-reminder-img"
image.src = "../_assets/brmReminder1.png";
let button = document.createElement("button");
button.innerHTML = "Okay";
button.id = "brm-reminder-btn";
let imgIndex = 1;
button.addEventListener("click", e => {
    imgIndex++;
    if (imgIndex == 4) {
        overlay.style.display = "none";
        box.style.display = "none";
        imgIndex = 1;
    }
    image.src = "../_assets/brmReminder" + imgIndex + ".png";
})
box.appendChild(image);
box.appendChild(button);
document.body.appendChild(overlay);
document.body.appendChild(box);

//numSecondsDelay = number of seconds until teacher pops up
let numSecondsDelay = 15*60;
if (localStorage.getItem("isptutor_brmStartTime") != null && Date.now() - localStorage.getItem("isptutor_brmStartTime") >= numSecondsDelay * 1000) {
    localStorage.removeItem("isptutor_brmStartTime");
    overlay.style.display = "block";
    box.style.display = "block";
}
/* fibscript.js v0.3
   Fill In Blank helper scripts
   original version by Chris Maverick
   11-24-19 */


function fibUpdate(mySelectId) {
    // sets a select's color based on the value sent to it

    var fibSel = document.getElementById(mySelectId);
    var answercolor = fibSel.options[fibSel.selectedIndex].value;
    fibSel.style.backgroundColor = answercolor;
}

function HideSeeText(myButtonID) {
    //do stuff
    var button = document.getElementById(myButtonID);
    button.onclick = function() {}
}

function toggleText() {
    var text = document.getElementById("demo");
    if (text.style.display === "none") {
      text.style.display = "block";
    } else {
      text.style.display = "none";
    }
  }









// nav button control
let numPages = document.getElementsByClassName("page").length;

let pageIndex = 0;
let backButtonInactive = document.getElementById("back-btn-inactive");
let nextButtonInactive = document.getElementById("next-btn-inactive");
let backButtonActive = document.getElementById("back-btn-active");
let nextButtonActive = document.getElementById("next-btn-active");

// handle only one page event
if (numPages == 1) {
    nextButtonInactive.style.display = "none";
}

// add event handlers if buttons exist in page
if (backButtonInactive) {
    backButtonInactive.addEventListener("mouseover", e => {
        document.getElementById("back-btn-active").style.display = "block";
    });
}
if (nextButtonInactive) {
    nextButtonInactive.addEventListener("mouseover", e => {
        document.getElementById("next-btn-active").style.display = "block";
    });
}
if (backButtonActive) {
    backButtonActive.addEventListener("mouseout", e => {
        document.getElementById("back-btn-active").style.display = "none";
    });
    backButtonActive.addEventListener("click", e => {
        pageIndex--;
        displayNavButtons();
        //document.getElementById("page" + (pageIndex + 2)).style.display = "none";
        clearPage();
        document.getElementById("page" + (pageIndex + 1)).style.display = "block";
        scrollTo(0, 0);
    });
}
if (nextButtonActive) {
    nextButtonActive.addEventListener("mouseout", e => {
        document.getElementById("next-btn-active").style.display = "none";
    });
    nextButtonActive.addEventListener("click", e => {
        pageIndex++;
        displayNavButtons();
        //document.getElementById("page" + pageIndex).style.display = "none";
        clearPage();
        document.getElementById("page" + (pageIndex + 1)).style.display = "block";
        scrollTo(0, 0);
    });
}

// manage clicks

function clearPage () {
    var tmpPages = document.getElementsByClassName("page");
    var i;
    for (i = 0; i < tmpPages.length; i++) {
        tmpPages[i].style.display = 'none';
    }
}

function displayNavButtons () {
    if (pageIndex == 0) {
        backButtonInactive.style.display = "none";
        backButtonActive.style.display = "none";
    }
    else {
        backButtonInactive.style.display = "block";
    }
    if (pageIndex == numPages - 1) {
        nextButtonInactive.style.display = "none";
        nextButtonActive.style.display = "none";
    }
    else {
        nextButtonInactive.style.display = "block";
    }
}

function tocPageJump (mySelectId) {
    //displays the page of the passed ID for Table of contents - MAV
    pageIndex = mySelectId-1;
    displayNavButtons();
    clearPage();
    document.getElementById("page" + mySelectId).style.display = "block";

}