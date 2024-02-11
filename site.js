window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollButton").style.display = "block";
    } else {
        document.getElementById("scrollButton").style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; /*Chrome, Safari, Opera */
    document.documentElement.scrollTop = 0; /*Firefox */
}

function copyText(message) {
    var textToCopy = "galek.job@tutamail.com";
    var messageElement = document.getElementById("copyMessage");
    navigator.clipboard.writeText(textToCopy).then(function() {
        if(message == 1){
        messageElement.textContent = "Copied!";
        messageElement.style.display = "block";
        setTimeout(function() {
            messageElement.style.display = "none";
          }, 2000);
        }
    }, function() {
      alert("Copy Error");
    });
}

function dropDownMenu(){
    document.getElementById("dropDownMenu").style.display = "block";
}
function hideDropDownMenu(){
    document.getElementById("dropDownMenu").style.display = "none";

}
function clickDropDown(){
    let display = document.getElementById("dropDownMenu").style.display;

    if(display == "none"){
        document.getElementById("dropDownMenu").style.display = "block";
    }else{
        document.getElementById("dropDownMenu").style.display = "none";
    }
}