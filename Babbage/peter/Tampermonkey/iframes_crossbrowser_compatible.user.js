const x = document.getElementById("myframe");
let y = (x.contentWindow || x.contentDocument);  // contentDocument is Mozilla Firefox, contentWindow is Google Chrome.
if (y.document) {
    y = y.document;
}
y.body.style.backgroundColor = "red";  // Of zoiets.
