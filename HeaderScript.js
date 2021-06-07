let LoadListeners = function() {
    document.querySelector( "#menu" ).addEventListener( "click", MenuClick );
    document.querySelector( "#header-holder li" ).addEventListener( "click", ItemClick );
}

let MenuClick = function() {
    let menu = document.querySelector( "#menu" );
    if ( menu.classList.contains( "expanded-menu" ) ) {
        menu.classList.remove( "expanded-menu" );
        menu.classList.add( "collapsed-menu" );
    }
}

let ItemClick = function() {
    let filePath = RetrieveDesiredPath( window.event.target );
    let scriptPath = RetrieveDesiredScript( window.event.target );
    console.log( "looking for: " + scriptPath);
    loadHTMLAt( filePath, "#site-content" );
    loadSketchScript( scriptPath );
}

let RetrieveDesiredPath = function( target ) {
    let folderAndFile = RetrieveFolderAndFile( target );
    let filePath = `${ folderAndFile[0] }Pages/${ folderAndFile[1] }.html`;

    return filePath;
}

let RetrieveDesiredScript = function( target ) {
    let folderAndFile = RetrieveFolderAndFile( target );
    let scriptPath = `${ folderAndFile[0] }Scripts/${ Depluralize( folderAndFile[1] ) }Sketch.js`;

    return scriptPath;
}

let RetrieveFolderAndFile = function( target ) {
    let folder = target.parentElement.previousSibling.previousSibling.innerText;
    let file = target.innerText.toLowerCase();

    return [folder, file];
}