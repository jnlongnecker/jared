window.onload = function () {
    let headerFile = "Site Pages/header.html";
    loadHTMLAt(headerFile, ".header-right");
    loadHTMLAt("Site Pages/home.html", "#site-content");
    loadSketchScript("CircleSketch.js");
}

let getHTMLFile = function(path, callback) {
    let xml = new XMLHttpRequest();
    xml.open('GET', path, true);
    xml.onreadystatechange = function() {
        if (this.status == 200)
            callback(this.responseText);
    }
    xml.send();
};

let loadHTMLAt = function( filePath, selector ) {
    getHTMLFile( filePath, function( responseHTML ) {
        document.querySelector( selector ).innerHTML = responseHTML;
    });
};

let loadSketchScript = function( scriptPath ) {
    let newScript = document.createElement( "script" );
    newScript.setAttribute( "id", "active-sketch" );
    newScript.setAttribute( "src", scriptPath );
    document.body.appendChild( newScript ); 
    newScript.onload = function() {
        customSetup();
    }
};