import {SoftwareProjectDicts} from "./SoftwareProject";

import fs from 'fs';
import {Detector} from "./detector/Detector";
import {Timer} from "./Timer";
import {ParserUtils} from "./ParserUtils";

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

    const path_to_folder_of_parsed_ast = "/Users/nbaumgartner/Documents/GitHub/data-Clumps/testDataParsedAst/argouml";
    let softwareProjectDicts: SoftwareProjectDicts = await ParserUtils.getDictClassOrInterfaceFromParsedAstFolder(path_to_folder_of_parsed_ast);

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
