const fs = require("fs");
const archiveDir = __dirname + "\\module-tracking.json";
const componentDir = __dirname + "\\public\\components";
let archive = JSON.parse(fs.readFileSync(archiveDir, "utf8"));

/*
 *  Entry point for Jwork framework.
 *  @returntype: string
 */
exports.rebuild = () => {
    let modulesToBuild = buildChanges();
    rebuildModules(modulesToBuild);
}

/*
 *  Builds all modules in the list, then updates the archive.
 *  @returntype: undefined
 */
function rebuildModules(moduleList) {
    if (!moduleList.length) return;

    for (let module of moduleList) {
        buildModule(module);
    }
    fs.writeFileSync(archiveDir, JSON.stringify(archive));
}

/*
 *  Retrieves the HTML, CSS and JS file content of the module, builds them into a file and creates the resulting component file.
 *  @returntype: undefined
 */
function buildModule(moduleName) {
    const filePath = __dirname + "\\src" + "\\" + moduleName + "\\" + moduleName;
    let htmlContent = fs.readFileSync(filePath + ".html", "utf8");
    let jsContent = fs.readFileSync(filePath + ".js", "utf8");
    let cssContent = "";
    if (fs.existsSync(filePath + ".css")) {
        cssContent = fs.readFileSync(filePath + ".css", "utf8");
    }
    let newJsContent = combineContent(jsContent, htmlContent, cssContent, moduleName);

    fs.writeFileSync(componentDir + `\\jwork-${moduleName}.js`, newJsContent);
}

/*
 *  Combines an HTML, CSS and JS file into a singular JS file to be used as a web component.
 *  @returntype: string
 */
function combineContent(js, html, css, moduleName) {
    let styles = `<style>${css}</style>\n<link rel="stylesheet" href="../styles/common.css" />\n`;
    let htmlContent = styles + html;
    let dependencyImports = getDependencyImports(html);
    let jsParts = buildJsParts(js);

    let jsContent = dependencyImports + "\n";
    jsContent += jsParts.imports;
    jsContent += `\n\nlet template = document.createElement("template");\ntemplate.innerHTML = \`${htmlContent}\`;`
    jsContent += "\n\nexport default class Jwork" + capitalize(moduleName) + " extends HTMLElement {\n";
    jsContent += writeConstructor(jsParts.constructorContent);
    jsContent += jsParts.classContent.trimEnd();
    jsContent += `\n}\n\ncustomElements.define('jwork-${moduleName.toLowerCase()}', Jwork${capitalize(moduleName)});`
    return jsContent.trim();
}

/*
 *  Returns an object that contains the JS file split into 3 core pieces: import statements, constructor content and 
 *  the remainder of the content in the class not in the constructor.
 *  @returntype: object
 */
function buildJsParts(js) {
    let jsParts = {};
    jsParts["imports"] = getImportsString(js);
    jsParts["constructorContent"] = getConstructorContent(js);
    jsParts["classContent"] = getClassContent(js);
    return jsParts;
}

function getDependencyImports(html) {
    let jworkRegex = /<jwork-[a-zA-Z0-9_]*?>/g
    let dependentComponents = html.match(jworkRegex);

    // Remove duplicates
    let dependencies = dependentComponents.filter((item, index, array) => array.indexOf(item) == index);

    let importString = "";
    for (let component of dependencies) {
        let componentName = component.substring(1, component.length - 1);
        importString += `import ${toPascalCase(componentName)} from "./${componentName}.js";\n`
    }
    return importString.substring(0, importString.length - 1);
}

/*
 *  Extracts all import statements in the JS file and returns a string with each on a new line.
 *  @returntype: string
 */
function getImportsString(js) {
    let allImportStatements = [];
    while (js.indexOf("import") != -1) {
        let startIndex = js.indexOf("import");
        let endIndex = js.indexOf(";", startIndex) + 1;
        let importStatement = js.substring(startIndex, endIndex);
        allImportStatements.push(importStatement);
        js = js.replace(importStatement, "");
    }
    let importString = "";
    for (let string of allImportStatements) {
        importString += string + "\n";
    }
    return importString.substring(0, importString.length - 1);
}

/*
 *  Extracts the content of the constructor, stripped of any HTML creation and super calls.
 *  @returntype: string
 */
function getConstructorContent(js) {
    if (js.indexOf("constructor(") == -1) return "}";

    const constructorRegex = /constructor.*?\{.*?(\{.*?\}.*?)*\}/s;
    let fullConstructor = js.match(constructorRegex)[0];
    let content = fullConstructor.replace(/constructor\(.*?{(.*?super.*?;)?/s, "");
    content = content.replace(/\n.*this.attachShadow.*;/gm, "");
    content = content.replace(/\n.*appendChild.*cloneNode\(true\).*;/, "");

    return content;
}

/*
 *  Creates a string containing JS code for the constructor of a component.
 *  @returntype: string
 */
function getClassContent(js) {
    const importRegex = /import.*;\s*\n/g;
    const classRegex = /export default class.*{/g;
    const constructorRegex = /constructor.*?\{.*?(\{.*?\}.*?)*\}/s;
    const endRegex = /}[^{}]*$/s;
    js = js.replace(importRegex, "");
    js = js.replace(classRegex, "");
    js = js.replace(constructorRegex, "");
    js = js.replace(endRegex, "");

    return js;
}

/*
 *  Creates a string containing JS code for the constructor of a component
 *  @returntype: string
 */
function writeConstructor(otherContent) {
    return `
    constructor() {
        super();
        this.template = this.attachShadow({ mode: "open" });
        this.template.appendChild(template.content.cloneNode(true));
        ${otherContent.trim()}\n`
}

/*
 *  Builds a list of all modules that need to be rebuilt
 *  @returntype: [string]
 */
function buildChanges() {
    let modulesToBuild = [];

    let srcModules = fs.readdirSync(__dirname + "/src", "utf8");
    for (let module of srcModules) {
        let moduleNeedsRebuilding = moduleModified(module);
        if (moduleNeedsRebuilding) {
            modulesToBuild.push(module);
        }
    }
    return modulesToBuild;
}

/*
 *  Returns true if the module has been modified since the last time it was built
 *  @returntype: boolean
 */
function moduleModified(moduleName) {
    if (moduleIsNew(moduleName)) {
        addModuleToJson(moduleName);
        return archive[moduleName] != 0;
    }

    let lastModifiedTime = getLastModifiedTimeOfModule(moduleName);
    if (lastModifiedTime > archive[moduleName]) {
        archive[moduleName] = lastModifiedTime;
        return true;
    }

    return false;
}

/*
 *  Retrieves the most recent modification date of all files in the module, returning 0 if empty
 *  @returntype: number
 */
function getLastModifiedTimeOfModule(moduleName) {
    const moduleDir = __dirname + "/src/" + moduleName;
    let srcFiles = fs.readdirSync(moduleDir, "utf8");

    let lastModifiedTime = 0;
    for (let fileName of srcFiles) {
        let fileStats = fs.statSync(moduleDir + "/" + fileName);
        if (fileStats.mtimeMs > lastModifiedTime) {
            lastModifiedTime = fileStats.mtimeMs;
        }
    }
    return lastModifiedTime;
}

/*
 *  Returns the input string turned from kebab-case to PascalCase.
 *  @returntype: string
 */
function toPascalCase(string) {
    let parts = string.split("-");
    if (!parts.length) return string;
    return capitalize(parts[0]) + capitalize(parts[1]);
}

/*
 *  Returns the input string capitalized.
 *  @returntype: string
 */
function capitalize(string) {
    let ret = string.toLowerCase();
    return ret.substring(0, 1).toUpperCase() + ret.substring(1);
}

/*
 *  Adds the module to the JSON archive
 *  @returntype: undefined
 */
const addModuleToJson = (moduleName) => archive[moduleName] = getLastModifiedTimeOfModule(moduleName);

/*
 *  Returns true if the module exists in the JSON, false otherwise
 *  @returntype: boolean
 */
const moduleIsNew = (moduleName) => archive[moduleName] == undefined;