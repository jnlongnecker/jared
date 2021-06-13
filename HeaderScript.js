let LoadListeners = function() {
    document.querySelector( "#menu" ).addEventListener( "click", MenuClick );
    document.querySelector( "#header-holder li" ).addEventListener( "click", ItemClick );
    document.querySelector( "#home" ).addEventListener( "click" , HomeClick );
    console.log( "listeners Loaded" );
}

let HomeClick = function() {
    loadHTMLAt("Site Pages/home.html", "#site-content", loadSketchScript, "PhysicsScripts/CircleSketch.js" );
}

let MenuClick = function() {
    let menuContent = document.querySelector( "#menu-content" );

    if ( menuContent.classList.contains( "expanded-menu" ) ) {
        menuContent.classList.remove( "expanded-menu" );
        menuContent.classList.add( "collapsed-menu" );
        return;
    }

    menuContent.classList.remove( "collapsed-menu" );
    menuContent.classList.add( "expanded-menu" );    
}

let ItemClick = function() {
    let filePath = RetrieveDesiredPath( window.event.target );
    let scriptPath = RetrieveDesiredScript( window.event.target );
    console.log( "looking for: " + scriptPath);
    loadHTMLAt( filePath, "#site-content", loadSketchScript, scriptPath );
}

let RetrieveDesiredPath = function( target ) {
    let folderAndFile = RetrieveFolderAndFile( target );
    let filePath = `${ folderAndFile[0] }Pages/${ folderAndFile[1].toLowerCase() }.html`;

    return filePath;
}

let RetrieveDesiredScript = function( target ) {
    let folderAndFile = RetrieveFolderAndFile( target );
    let scriptPath = `${ folderAndFile[0] }Scripts/${ Depluralize( folderAndFile[1] ) }Sketch.js`;

    return scriptPath;
}

let RetrieveFolderAndFile = function( target ) {
    let folder = target.parentElement.previousSibling.previousSibling.innerText;
    let file = target.innerText;

    return [folder, file];
}