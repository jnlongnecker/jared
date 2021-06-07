window.onload = function () {
    let headerFile = "Site Pages/header.html";
    loadHTMLAt(headerFile, "#header-holder", loadHeaderScript );
    
    loadHTMLAt("Site Pages/home.html", "#site-content", loadSketchScript, "PhysicsScripts/CircleSketch.js" );
    
}

let getHTMLFile = function(path, callback) {
    let xml = new XMLHttpRequest();
    xml.open( 'GET', path, true );
    xml.onreadystatechange = function() {
        if ( this.readyState == 4 && this.status == 200 )
            callback( this.responseText );
    }
    xml.send();
};

let loadHTMLAt = function( filePath, selector, callback, cbParam ) {
    getHTMLFile( filePath, function( responseHTML ) {
        document.querySelector( selector ).innerHTML = responseHTML;
        callback( cbParam );
    });
};

let loadSketchScript = function( scriptPath ) {
    let oldScript = document.querySelector( "#active-sketch" );
    if ( oldScript )  oldScript.remove();

    let newScript = document.createElement( "script" );
    newScript.setAttribute( "id", "active-sketch" );
    newScript.setAttribute( "src", scriptPath );
    document.body.appendChild( newScript ); 
    newScript.onload = function() {
        customSetup();
    }
};

let loadHeaderScript = function() {
    let headerScript = document.createElement( "script" );
    headerScript.setAttribute( "src", "HeaderScript.js" );
    document.body.appendChild( headerScript );
    headerScript.onload = function() {
        LoadListeners();
    }
}