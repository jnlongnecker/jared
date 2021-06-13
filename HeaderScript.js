let LoadListeners = function() {
    document.querySelector( "#menu" ).addEventListener( "click", MenuClick );
    document.querySelector( "#header-holder li" ).addEventListener( "click", ItemClick );
    console.log( "listeners Loaded" );
}

let MenuClick = function() {
    let header = document.querySelector( ".header" );
    if ( header.classList.contains( "expanded-menu" ) ) {
        header.classList.remove( "expanded-menu" );
        header.classList.add( "collapsed-menu" );
    }

    let menuContent = document.querySelector( "#menu-content" );
    console.log( menuContent.classList );

    setTimeout( function() {
        if ( menuContent.classList.contains( "fly-in" ) ) {
            menuContent.classList.remove( "fly-in" );
            menuContent.classList.add( "fly-out" );
            return;
        }
        menuContent.classList.remove( "fly-out" );
        menuContent.classList.add( "fly-in" );
    }, 1000 );
    
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