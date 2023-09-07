import {SoftwareProjectDicts} from "./SoftwareProject";

import fs from 'fs';
import {Detector} from "./detector/Detector";
import {Timer} from "./Timer";
import {ParserHelper} from "./ParserHelper";
import path from "path";

const packageJsonPath = path.join(__dirname, '..','..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

async function generateAstCallback(timer, message, index, total): Promise<void> {
    let isEveryHundreds = index % 100 === 0;
    let firstAndSecond = index === 0 || index === 1;
    let lastAndPreLast = index === total - 1 || index === total - 2;
    if(firstAndSecond || isEveryHundreds || lastAndPreLast) {
        let content = `${index}/${total}: ${message}`;
        timer.printElapsedTime(null ,content);
    }
}

async function main() {
    console.log("Development started");
    let timer: Timer = new Timer();
    timer.start();

    const path_to_folder_of_parsed_ast = "./../testDataParsedAst";
    const path_to_folder_of_ast_generator = "./../astGenerator";
    let path_to_source_code = "./../astGenerator/testSrc/java";
    path_to_source_code = "/Users/nbaumgartner/Desktop/LCSD-Paper/Data_for_Paper/ArgoUML_src/src/argouml-app/src"
    path_to_source_code = "/Users/nbaumgartner/Documents/GitHub/data-clumps-doctor/astGenerator"
    path_to_source_code = "/Users/nbaumgartner/Documents/GitHub/Live-Code-Smell-Detection-of-Data-Clumps-in-an-Integrated-Development-Environment/Source Code/src/main/java/com/github/fiadleh/codesmellsplugin"

    await ParserHelper.parseSourceCodeToAst(path_to_source_code, path_to_folder_of_parsed_ast, path_to_folder_of_ast_generator);

    let softwareProjectDicts: SoftwareProjectDicts = await ParserHelper.getDictClassOrInterfaceFromParsedAstFolder(path_to_folder_of_parsed_ast);

    let detectorOptions = {};
    let progressCallback = generateAstCallback.bind(null, timer);
    let detector = new Detector(softwareProjectDicts, detectorOptions, progressCallback);

    let dataClumpsContext = await detector.detect();
    await ParserHelper.removeGeneratedAst(path_to_folder_of_parsed_ast);

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

    timer.stop();
    timer.printElapsedTime("Detection time");

    console.log("Amount dataclumps: "+Object.keys(dataClumpsContext.data_clumps).length);
    console.log("Development finished");
}

main();
