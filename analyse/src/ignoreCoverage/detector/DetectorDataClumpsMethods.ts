import {DetectorUtils} from "./DetectorUtils";
import {DataClumpTypeContext, Dictionary} from "data-clumps-type-context";
import {MethodTypeContext} from "./../ParsedAstTypes";
import {SoftwareProjectDicts} from "./../SoftwareProject";
import {DetectorOptions, DetectorOptionsInformation} from "./Detector";
import {DetectorDataClumpsMethodsToOtherMethods} from "./DetectorDataClumpsMethodsToOtherMethods";
import {DetectorDataClumpsMethodsToOtherFields} from "./DetectorDataClumpsMethodsToOtherFields";

// TODO refactor this method to Detector since there is already the creation, so why not the refactoring
function getParsedValuesFromPartialOptions(rawOptions: DetectorOptions): DetectorOptions{

    function parseBoolean(value: any){
        return ""+value==="true";
    }

    rawOptions.sharedParametersToParametersAmountMinimum = parseInt(rawOptions.sharedParametersToParametersAmountMinimum)
    //rawOptions.sharedMethodParametersHierarchyConsidered = parseBoolean(rawOptions.sharedMethodParametersHierarchyConsidered)
    //rawOptions.sharedFieldParametersCheckIfAreSubtypes = parseBoolean(rawOptions.sharedFieldParametersCheckIfAreSubtypes);

    return rawOptions;
}

export class DetectorDataClumpsMethods {

    public options: DetectorOptions;
    public progressCallback: any;
    public toOtherMethodsDetector: DetectorDataClumpsMethodsToOtherMethods;
    public toOtherFieldsDetector: DetectorDataClumpsMethodsToOtherFields;

    public constructor(options: DetectorOptions, progressCallback?: any){
        this.options = getParsedValuesFromPartialOptions(JSON.parse(JSON.stringify(options)));
        this.progressCallback = progressCallback;
        this.toOtherMethodsDetector = new DetectorDataClumpsMethodsToOtherMethods(options, progressCallback);
        this.toOtherFieldsDetector = new DetectorDataClumpsMethodsToOtherFields(options, progressCallback);
    }

    public async detect(softwareProjectDicts: SoftwareProjectDicts): Promise<Dictionary<DataClumpTypeContext> | null>{
        //console.log("Detecting software project for data clumps in methods");
        let methodsDict = softwareProjectDicts.dictMethod;
        let methodKeys = Object.keys(methodsDict);
        let detectedDataClumpsDict: Dictionary<DataClumpTypeContext> = {};

        let amountMethods = methodKeys.length;
        let index = 0;
        for (let methodKey of methodKeys) {
            if(this.progressCallback){
                await this.progressCallback("Parameter Detector: "+methodKey, index, amountMethods);
            }
            let method = methodsDict[methodKey];

            this.analyzeMethod(method, softwareProjectDicts, detectedDataClumpsDict);
            index++;
        }
        return detectedDataClumpsDict;
    }

    /**
     * DataclumpsInspection.java line 370
     * @param method
     * @param methodToClassOrInterfaceDict
     * @private
     */
    private analyzeMethod(method: MethodTypeContext, softwareProjectDicts: SoftwareProjectDicts, dataClumpsMethodParameterDataClumps: Dictionary<DataClumpTypeContext>){

        let currentClassOrInterface = MethodTypeContext.getClassOrInterface(method, softwareProjectDicts);
        if(currentClassOrInterface.auxclass){ // ignore auxclasses as are not important for our project
            return;
        }


        //console.log("Analyze method: "+method.key);
        let methodParameters = method.parameters;

        let methodParametersKeys = Object.keys(methodParameters);
        let amountOfMethodParameters = methodParametersKeys.length;
        if(amountOfMethodParameters < this.options.sharedParametersToParametersAmountMinimum){
            //console.log("Method " + method.key + " has less than " + this.options.sharedParametersToParametersAmountMinimum + " parameters. Skipping this method.")
            return;
        }

        if(!this.options.analyseMethodsWithUnknownHierarchy){
            //console.log("- check if methods hierarchy is complete")
//            let wholeHierarchyKnown = method.isWholeHierarchyKnown(softwareProjectDicts)
            let wholeHierarchyKnown = MethodTypeContext.isWholeHierarchyKnown(method, softwareProjectDicts);
            if(!wholeHierarchyKnown){ // since we dont the complete hierarchy, we can't detect if a method is inherited or not
                //console.log("-- check if methods hierarchy is complete")
                return; // therefore we stop here
            }
        }


        /* "These methods should not in a same inheritance hierarchy" */
        /* "[...] we should exclude methods inherited from parent-classes. " */
        // it is not enough to check if the classes are in the same hierarchy
        // DataclumpsInspection.java line 376
        /**
         * From: "Improving the Precision of Fowler’s Definitions of Bad Smells"
         * "These methods should not in a same inheritance hierarchy and with a same method signature."
         *
         * We do not exclude a method if the method signature is same, it has also to have the same inheritance to be excluded
         * This checks same inheritance PART 1/2 (see also Part 2)
         */
        let thisMethodIsInherited = method.isInheritedFromParentClassOrInterface(softwareProjectDicts);
        if(thisMethodIsInherited) { // if the method is inherited
            // then skip this method
            return;
        }


        // we assume that all methods are not constructors
        this.toOtherMethodsDetector.checkParameterDataClumps(method, softwareProjectDicts, dataClumpsMethodParameterDataClumps);
        this.toOtherFieldsDetector.checkFieldDataClumps(method, softwareProjectDicts, dataClumpsMethodParameterDataClumps)
    }

}
