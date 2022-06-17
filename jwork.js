const fs = require("fs");
const archiveDir = __dirname + "/module-tracking.json";
const componentDir = __dirname + "/public/components";
let archive = JSON.parse(fs.readFileSync(archiveDir, "utf8"));

exports.getRoutes = () => {
    let routeList = [];

    let pages = fs.readdirSync(__dirname + "/pages");
    pages.forEach((file) => {
        file = file.substring(0, file.indexOf(".html"));
        routeList.push(file);
    });

    return routeList;
}

/*
 *  Entry point for Jwork framework.
 *  @returntype: undefined
 */
exports.rebuild = () => {
    let modulesToBuild = buildChanges();
    rebuildModules(modulesToBuild);
}

/*
 *  Rebuilds all modules
 *  @returntype: undefined
 */
exports.buildAll = () => {
    rebuildModules(allSourceModules());
}

/*
 *  Builds all modules in the list, then updates the archive.
 *  @returntype: undefined
 */
function rebuildModules(moduleList) {
    if (!moduleList.length) return;

    console.log("Rebuilding modules");

    for (let module of moduleList) {
        buildModule(module);
        transferModules(module);
    }
    fs.writeFileSync(archiveDir, JSON.stringify(archive));
}

/*
 *  Transfers non-component modules to the component directory.
 *  @returntype: undefined
 */
function transferModules(moduleName) {
    const moduleDir = __dirname + "/src/" + moduleName;
    let filesInModule = fs.readdirSync(moduleDir, "utf8");
    for (let file of filesInModule) {
        if (file.indexOf(moduleName) != -1) continue;
        let fileContent = fs.readFileSync(moduleDir + "/" + file, "utf8");
        fs.writeFileSync(componentDir + "/" + file, fileContent);
    }
}

/*
 *  Retrieves the HTML, CSS and JS file content of the module, builds them into a file and creates the resulting component file.
 *  @returntype: undefined
 */
function buildModule(moduleName) {
    const filePath = __dirname + "/src" + "/" + moduleName + "/" + moduleName;
    if (!fs.existsSync(filePath + ".html")) {
        return;
    }
    let htmlContent = fs.readFileSync(filePath + ".html", "utf8");
    let jsContent = fs.readFileSync(filePath + ".js", "utf8");
    let cssContent = "";
    if (fs.existsSync(filePath + ".css")) {
        cssContent = fs.readFileSync(filePath + ".css", "utf8");
    }
    let newJsContent = combineContent(jsContent, htmlContent, cssContent, moduleName);

    fs.writeFileSync(componentDir + `/jwork-${toKebabCase(moduleName)}.js`, newJsContent);
}

/*
 *  Combines an HTML, CSS and JS file into a singular JS file to be used as a web component.
 *  @returntype: string
 */
function combineContent(js, html, css, moduleName) {
    js = js.replace(/ {4}/g, "\t");
    let styles = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" />`;
    styles += `<link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />\n<style>${css}</style>\n`;
    let htmlContent = styles + html;
    let dependencyImports = getDependencyImports(html);
    let jsParts = buildJsParts(js);
    let useShadow = js.indexOf("jwork flag no-shadow") == -1;

    let jsContent = dependencyImports + "\n";
    jsContent += jsParts.imports;
    jsContent += `\n\nlet template = document.createElement("template");\ntemplate.innerHTML = \`${htmlContent}\`;`
    jsContent += "\n\nexport default class Jwork" + capitalize(moduleName) + " extends HTMLElement {\n";
    jsContent += writeConstructor(jsParts.constructorContent, useShadow);
    jsContent += writeBody(jsParts.classContent, useShadow);
    jsContent += `\n}\n\ncustomElements.define('jwork-${toKebabCase(moduleName)}', Jwork${capitalize(moduleName)});`
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

/*
 *  Fetches all custom component references and adds an import statement for them, returning the string of all imports.
 *  @returntype: string
 */
function getDependencyImports(html) {
    let jworkRegex = /<jwork-[a-zA-Z0-9_-]*?(>| )/g
    let dependentComponents = html.match(jworkRegex);
    if (!dependentComponents) return "";

    // Remove duplicates
    let dependencies = dependentComponents.filter((item, index, array) => array.indexOf(item) == index);

    let importString = "";
    for (let component of dependencies) {
        let componentName = component.substring(1, component.length - 1);
        console.log(componentName);
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
    if (js.indexOf("constructor(") == -1) return "\t}";

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
    const constructorRegex = /constructor.*?\{.*?(\{.*?\}.*?)*\}/s;
    let startIndex = js.indexOf("{", js.indexOf("export default class")) + 1;
    let endIndex = js.lastIndexOf("}");

    let classContent = js.substring(startIndex, endIndex);
    return classContent.replace(constructorRegex, "");
}

/*
 *  Creates a string containing JS code for the constructor of a component
 *  @returntype: string
 */
function writeConstructor(otherContent, useShadow) {
    return `
\tconstructor() {` + (useShadow ? `
\t\tsuper();
\t\tthis.template = this.attachShadow({ mode: "open" });
\t\tthis.template.appendChild(template.content.cloneNode(true));
${otherContent.trimEnd()}\n` : `
\t\tsuper();
${otherContent.trimEnd()}\n`);
}

function writeBody(bodyContent, useShadow) {
    if (useShadow) return bodyContent;
    let contentCreationString = "\n\t\tthis.appendChild(template.content.cloneNode(true));";

    if (bodyContent.indexOf("connectedCallback()") == -1) {
        return `\tconnectedCallback() {${contentCreationString}\n\t}\n` + bodyContent;
    }

    let startIndex = bodyContent.indexOf("{", bodyContent.indexOf("connectedCallback"));
    return bodyContent.substring(0, startIndex + 1) + contentCreationString + bodyContent.substring(startIndex + 1);
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
 *  Retrieves all modules in SRC
 *  @returntype: [string]
 */
function allSourceModules() {
    let modules = [];

    let srcModules = fs.readdirSync(__dirname + "/src", "utf8");
    for (let module of srcModules) {
        modules.push(module);
    }
    return modules;
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
    return parts.reduce((previous, current) => previous + capitalize(current));
}

/*
 *  Returns the input string turned from PascalCase or camelCase to kebab-case.
 *  @returntype: string
 */
function toKebabCase(string) {
    string = string + " ";
    let parts = string.match(/.*?[a-z0-9_](?=[A-Z ])/g);
    return parts.reduce((previous, current) => previous.toLowerCase() + "-" + current.toLowerCase());
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