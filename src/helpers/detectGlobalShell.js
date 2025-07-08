if (window.self === window.top) {
    document.body.classList.add("standalone");
} else {
    document.body.classList.add("embedded");
}