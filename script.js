
function toggleHeader(id) {
    var header = document.getElementById(id);
    var list = document.getElementById(id + '_list');
    if (header.style.display === "none") {
    header.style.display = "block";
    list.style.display = "block";
    } else {
    header.style.display = "none";
    list.style.display = "none";
    }
}
