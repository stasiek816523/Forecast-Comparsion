
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollButton").style.display = "block";
    } else {
        document.getElementById("scrollButton").style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; /* Dla przeglądarek Chrome, Safari i Opera */
    document.documentElement.scrollTop = 0; /* Dla przeglądarki Firefox */
}
