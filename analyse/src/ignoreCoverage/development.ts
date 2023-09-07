import {SoftwareProjectDicts} from "./SoftwareProject";

import fs from 'fs';
import path from 'path';
import {Detector} from "./detector/Detector";
import {Dictionary} from "./UtilTypes";
import {ClassOrInterfaceTypeContext} from "./ParsedAstTypes";
import {Timer} from "./Timer";

function saveJSONFile(softwareProjectDicts, file_name){
    const jsonData = JSON.stringify(softwareProjectDicts, null, 2); // Convert the JSON object to a string with indentation

    try {
        fs.writeFileSync(file_name, jsonData, 'utf8');
        console.log('JSON data has been successfully saved to file.');
    } catch (err) {
        console.error('An error occurred while writing to file:', err);
    }
}

function loadJSONFile(file_name): Dictionary<ClassOrInterfaceTypeContext> | null{
    try {
        const loadedData = fs.readFileSync(file_name, 'utf8');
        const loadedJsonData: Dictionary<ClassOrInterfaceTypeContext> = JSON.parse(loadedData); // Parse the JSON data
        console.log('JSON data loaded from file');
        return loadedJsonData;
    } catch (err) {
        console.error('An error occurred while reading the file:', err);
        return null;
    }
}

async function generateAstCallback(timer, message, index, total): Promise<void> {
    let isEveryHundreds = index % 100 === 0;
    let firstAndSecond = index === 0 || index === 1;
    let lastAndPreLast = index === total - 1 || index === total - 2;
    if(firstAndSecond || isEveryHundreds || lastAndPreLast) {
        let content = `${index}/${total}: ${message}`;
        timer.printElapsedTime(null ,content);
    }
}

async function getDictClassOrInterfaceFromParsedAstFolder(path_to_folder_of_parsed_ast){
    let softwareProjectDicts: SoftwareProjectDicts = new SoftwareProjectDicts();

    console.log("Reading files and adding to project");
    let filesAndFoldersInPath = fs.readdirSync(path_to_folder_of_parsed_ast, { withFileTypes: true });
    for (let fileOrFolder of filesAndFoldersInPath) {
        let fullPath = path.join(path_to_folder_of_parsed_ast, fileOrFolder.name);
        if (fileOrFolder.isDirectory()) {
            continue;
        } else {
            let fileContent = fs.readFileSync(fullPath, 'utf-8');
            const loadedJsonData: any = JSON.parse(fileContent); // Parse the JSON data
            const classOrInterfaceTypeContext: ClassOrInterfaceTypeContext = ClassOrInterfaceTypeContext.fromObject(loadedJsonData);
            softwareProjectDicts.loadClassOrInterface(classOrInterfaceTypeContext);
        }
    }

    console.log("Amount of classes and interfaces: "+Object.keys(softwareProjectDicts.dictClassOrInterface).length);
    console.log("Amount of methods: "+Object.keys(softwareProjectDicts.dictMethod).length);
    console.log("Amount of fields: "+Object.keys(softwareProjectDicts.dictMemberFieldParameters).length);

    return softwareProjectDicts
}

async function main() {
    console.log("Development started");

    const path_to_folder_of_parsed_ast = "/Users/nbaumgartner/Documents/GitHub/data-Clumps/testDataParsedAst/argouml";
    let softwareProjectDicts: SoftwareProjectDicts = await getDictClassOrInterfaceFromParsedAstFolder(path_to_folder_of_parsed_ast);

    let detectorOptions = {};
    let timer: Timer = new Timer();
    let progressCallback = generateAstCallback.bind(null, timer);
    let detector = new Detector(softwareProjectDicts, detectorOptions, progressCallback);

    timer.start();
    let dataClumpsContext = await detector.detect();
    timer.stop();
    timer.printElapsedTime("Detection time");

    console.log("Amount dataclumps: "+Object.keys(dataClumpsContext.data_clumps).length);
    console.log("Development finished");

    let result_path = "../data-clumps-result.json";

    // delete file if exists
    if(fs.existsSync(result_path)){
        fs.unlinkSync(result_path);
    }

    // save to file
    try {
        fs.writeFileSync("../data-clumps-result.json", JSON.stringify(dataClumpsContext, null, 2), 'utf8');
        console.log('JSON data has been successfully saved to file.');
    } catch (err) {
        console.error('An error occurred while writing to file:', err);
    }
}

main();
