import {DetectorUtils} from "./DetectorUtils";
import {DataClumpTypeContext, Dictionary} from "data-clumps-type-context";
import {ClassOrInterfaceTypeContext, MethodTypeContext} from "./../ParsedAstTypes";
import {SoftwareProjectDicts} from "./../SoftwareProject";
import {DetectorOptions, DetectorOptionsInformation} from "./Detector";
import {DetectorDataClumpsFields} from "./DetectorDataClumpsFields";

// TODO refactor this method to Detector since there is already the creation, so why not the refactoring
function getParsedValuesFromPartialOptions(rawOptions: DetectorOptions): DetectorOptions{

    function parseBoolean(value: any){
        return ""+value==="true";
    }

    rawOptions.sharedParametersToParametersAmountMinimum = parseInt(rawOptions.sharedParametersToParametersAmountMinimum)
    //rawOptions.sharedMethodParametersHierarchyConsidered = parseBoolean(rawOptions.sharedMethodParametersHierarchyConsidered)
    //rawOptions.sharedFieldParametersCheckIfAreSubtypes = parseBoolean(rawOptions.sharedFieldParametersCheckIfAreSubtypes);
    rawOptions.sharedFieldsToFieldsAmountMinimum = parseInt(rawOptions.sharedFieldsToFieldsAmountMinimum)
    rawOptions.analyseFieldsInClassesOrInterfacesInheritedFromSuperClassesOrInterfaces = parseBoolean(rawOptions.analyseFieldsInClassesOrInterfacesInheritedFromSuperClassesOrInterfaces)
    rawOptions.analyseFieldsOfClassesWithUnknownHierarchy = parseBoolean(rawOptions.analyseFieldsOfClassesWithUnknownHierarchy);

    return rawOptions;
}

export class DetectorDataClumpsMethodsToOtherFields {

    public static TYPE = "parameters_to_fields_data_clump"

    public options: DetectorOptions;
    public progressCallback: any;

    public constructor(options: DetectorOptions, progressCallback?: any){
        this.options = getParsedValuesFromPartialOptions(JSON.parse(JSON.stringify(options)));
        this.progressCallback = progressCallback;
    }

    /**
     * DataclumpsInspection.java line 487
     * @param method
     * @param methodToClassOrInterfaceDict
     * @private
     */
    public checkFieldDataClumps(method: MethodTypeContext, softwareProjectDicts: SoftwareProjectDicts, dataClumpsMethodParameterDataClumps: Dictionary<DataClumpTypeContext>){
        //console.log("Checking parameter data clumps for method " + method.key);

        let classesOrInterfacesDict = softwareProjectDicts.dictClassOrInterface;
        let otherClassesOrInterfacesKeys = Object.keys(classesOrInterfacesDict);
        for (let classOrInterfaceKey of otherClassesOrInterfacesKeys) {
            let otherClassOrInterface = classesOrInterfacesDict[classOrInterfaceKey];

            if(otherClassOrInterface.auxclass){ // ignore auxclasses as are not important for our project
                return;
            }

            let foundDataClumps = this.checkMethodParametersForDataClumps(method, otherClassOrInterface, softwareProjectDicts, dataClumpsMethodParameterDataClumps);
        }
    }


    /**
     * DataclumpsInspection.java line 547
     * @param method
     * @param otherClassOrInterface
     * @param softwareProjectDicts
     * @param dataClumpsMethodParameterDataClumps
     * @private
     */
    private checkMethodParametersForDataClumps(method: MethodTypeContext,otherClassOrInterface: ClassOrInterfaceTypeContext, softwareProjectDicts: SoftwareProjectDicts, dataClumpsMethodParameterDataClumps: Dictionary<DataClumpTypeContext>) {
        //console.log("--- otherMethod"+ otherMethod.key)


        let currentClassOrInterfaceKey = method.classOrInterfaceKey;
        let currentClassOrInterface = softwareProjectDicts.dictClassOrInterface[currentClassOrInterfaceKey];
        let parameters = method.parameters;

        if(!this.options.analyseFieldsOfClassesWithUnknownHierarchy){
            //console.log("- check if hierarchy is complete")
            let wholeHierarchyKnown = currentClassOrInterface.isWholeHierarchyKnown(softwareProjectDicts)
            if(!wholeHierarchyKnown){ // since we dont the complete hierarchy, we can't detect if a class is inherited or not
                //console.log("-- check if hierarchy is complete")
                return; // therefore we stop here
            }
        }

        let analyseFieldsInClassesOrInterfacesInheritedFromSuperClassesOrInterfaces = this.options.analyseFieldsInClassesOrInterfacesInheritedFromSuperClassesOrInterfaces;
        let otherClassParameters = DetectorDataClumpsFields.getMemberParametersFromClassOrInterface(otherClassOrInterface, softwareProjectDicts, analyseFieldsInClassesOrInterfacesInheritedFromSuperClassesOrInterfaces);
        let amountCommonParameters = DetectorUtils.getCommonParameterPairKeys(parameters, otherClassParameters);

        //console.log("Amount of common parameters: "+amountCommonParameters);
        if(amountCommonParameters < this.options.sharedParametersToParametersAmountMinimum) { // is not a data clump
            //console.log("Method " + method.key + " and method " + otherMethod.key + " have less than " + this.options.sharedParametersToParametersAmountMinimum + " common parameters. Skipping this method.")
            return;
        } else {
            //console.log("- Found data clumps between method " + method.key + " and method " + otherMethod.key);
            let commonMethodParameterPairKeys = DetectorUtils.getCommonParameterPairKeys(method.parameters, otherClassParameters);

            let [currentParameters, commonFieldParamterKeysAsKey] = DetectorUtils.getCurrentAndOtherParametersFromCommonParameterPairKeys(commonMethodParameterPairKeys, method.parameters, otherClassParameters)

            let currentClassOrInterface = softwareProjectDicts.dictClassOrInterface[method.classOrInterfaceKey];

            let fileKey = currentClassOrInterface.file_path;

            let data_clump_type = DetectorDataClumpsMethodsToOtherFields.TYPE;
            let dataClumpContext: DataClumpTypeContext = {
                type: "data_clump",
                key: data_clump_type+"-"+fileKey+"-"+currentClassOrInterface.key+"-"+otherClassOrInterface.key+"-"+commonFieldParamterKeysAsKey, // typically the file path + class name + method name + parameter names

                from_file_path: fileKey,
                from_class_or_interface_name: currentClassOrInterface.name,
                from_class_or_interface_key: currentClassOrInterface.key,
                from_method_name: method.name,
                from_method_key: method.key,

                to_file_path: otherClassOrInterface.file_path,
                to_class_or_interface_name: otherClassOrInterface.name,
                to_class_or_interface_key: otherClassOrInterface.key,
                to_method_name: null,
                to_method_key: null,

                data_clump_type: data_clump_type, // "parameter_data_clump" or "field_data_clump"
                data_clump_data: currentParameters
            }
            dataClumpsMethodParameterDataClumps[dataClumpContext.key] = dataClumpContext;

        }
    }

}
