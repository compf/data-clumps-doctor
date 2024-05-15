import {SoftwareProjectDicts} from "../SoftwareProject";
import {Dictionary} from "../UtilTypes";
import {DataClumpsVariableFromContext, DataClumpsVariableToContext,} from "data-clumps-type-context";
import {ClassOrInterfaceTypeContext, MemberFieldParameterTypeContext, VariableTypeContext} from "../ParsedAstTypes";

type ParameterPair = {
    parameterKey: string;
    otherParameterKey: string;
    probability: number | null;
}

export class DetectorUtils {

    private static calculateProbabilityOfDataClumps(currentProbabilityModifier: number, otherProbabilityModifier: number, parameterPairs: ParameterPair[]){
        let modifierCurrentClassKnown = currentProbabilityModifier
        let modifierOtherClassKnown = otherProbabilityModifier

        let averageParameterSimilarity = 0;
        let amountCommonParameters = parameterPairs.length;
        if(amountCommonParameters > 0){
            let sumOfParameterSimilarities = 0;
            for(let parameterPair of parameterPairs){
                if(parameterPair.probability){
                    sumOfParameterSimilarities += parameterPair.probability;
                }
            }
            averageParameterSimilarity = sumOfParameterSimilarities / amountCommonParameters;
        }

        let probabilityOfDataClumps = modifierCurrentClassKnown * modifierOtherClassKnown * averageParameterSimilarity;
        return probabilityOfDataClumps;
    }

    public static calculateProbabilityOfDataClumpsFields(currentClassWholeHierarchyKnown: boolean, otherClassWholeHierarchyKnown: boolean, parameterPairs: ParameterPair[], fieldsOfClassesWithUnknownHierarchyProbabilityModifier: number){
        let currentModifier = 1
        if(!currentClassWholeHierarchyKnown){
            currentModifier = fieldsOfClassesWithUnknownHierarchyProbabilityModifier * currentModifier
        }

        let otherModifier = 1
        if(!otherClassWholeHierarchyKnown){
            otherModifier = fieldsOfClassesWithUnknownHierarchyProbabilityModifier * otherModifier
        }

        let probabilityOfDataClumps = DetectorUtils.calculateProbabilityOfDataClumps(currentModifier, otherModifier, parameterPairs);
        return probabilityOfDataClumps;
    }

    public static calculateProbabilityOfDataClumpsMethodsToMethods(currentClassWholeHierarchyKnown: boolean, otherClassWholeHierarchyKnown: boolean, parameterPairs: ParameterPair[], methodsOfClassesOrInterfacesWithUnknownHierarchyProbabilityModifier: number){
        let currentModifier = 1;
        if(!currentClassWholeHierarchyKnown){
            currentModifier = methodsOfClassesOrInterfacesWithUnknownHierarchyProbabilityModifier * currentModifier
        }
        let otherModifier = 1;
        if(!otherClassWholeHierarchyKnown){
            otherModifier = methodsOfClassesOrInterfacesWithUnknownHierarchyProbabilityModifier * otherModifier
        }

        let probabilityOfDataClumps = DetectorUtils.calculateProbabilityOfDataClumps(currentModifier, otherModifier, parameterPairs);
        return probabilityOfDataClumps;
    }

    public static calculateProbabilityOfDataClumpsMethodsToFields(currentClassWholeHierarchyKnown: boolean, otherClassWholeHierarchyKnown: boolean, parameterPairs: ParameterPair[], methodsOfClassesOrInterfacesWithUnknownHierarchyProbabilityModifier: number, fieldsOfClassesWithUnknownHierarchyProbabilityModifier: number){
        let currentModifier = 1;
        if(!currentClassWholeHierarchyKnown){
            currentModifier = methodsOfClassesOrInterfacesWithUnknownHierarchyProbabilityModifier * currentModifier
        }

        let otherModifier = 1;
        if(!otherClassWholeHierarchyKnown){
            otherModifier = fieldsOfClassesWithUnknownHierarchyProbabilityModifier * otherModifier
        }

        let probabilityOfDataClumps = DetectorUtils.calculateProbabilityOfDataClumps(currentModifier, otherModifier, parameterPairs);
        return probabilityOfDataClumps;
    }


    public static getCommonParameterPairKeys(parameters: VariableTypeContext[], otherParameters: VariableTypeContext[], similarityModifierOfVariablesWithUnknownType, ignoreParameterModifiers: boolean){


        let commonParameterPairKeys: ParameterPair[] = [];
        for(let parameter of parameters){
            for(let otherParameter of otherParameters){
                let probabilityOfSimilarity = parameter.isSimilarTo(otherParameter, similarityModifierOfVariablesWithUnknownType, ignoreParameterModifiers)
                if(probabilityOfSimilarity > 0.5){
                    let commonParameterPairKey = {
                        parameterKey: parameter.key,
                        otherParameterKey: otherParameter.key,
                        probability: probabilityOfSimilarity
                    }
                    commonParameterPairKeys.push(commonParameterPairKey);
                }
            }
        }
        return commonParameterPairKeys;
    }

    public static getCurrentAndOtherParametersFromCommonParameterPairKeys(commonFieldParameterPairKeys: ParameterPair[], currentClassParameters: VariableTypeContext[], otherClassParameters: VariableTypeContext[])
        :[Dictionary<DataClumpsVariableFromContext>, string]
    {
        let currentParameters: Dictionary<DataClumpsVariableFromContext> = {};

        let commonFieldParameterKeysAsKey = "";

        for(let commonFieldParameterPairKey of commonFieldParameterPairKeys){

            let currentFieldParameterKey = commonFieldParameterPairKey.parameterKey;
            for(let currentClassParameter of currentClassParameters){
                if(currentClassParameter.key === currentFieldParameterKey){
                    commonFieldParameterKeysAsKey += currentClassParameter.name;

                    let related_to_context: any | DataClumpsVariableToContext = null;

                    let otherFieldParameterKey = commonFieldParameterPairKey.otherParameterKey;
                    for(let otherClassParameter of otherClassParameters){
                        if(otherClassParameter.key === otherFieldParameterKey){

                            let related_to_parameter: DataClumpsVariableToContext = {
                                key: otherClassParameter.key,
                                name: otherClassParameter.name,
                                // @ts-ignore
                                type: otherClassParameter.type,
                                displayedType: currentClassParameter.displayedType,
                                modifiers: otherClassParameter.modifiers,
                                position: {
                                    startLine: otherClassParameter.position?.startLine,
                                    startColumn: otherClassParameter.position?.startColumn,
                                    endLine: otherClassParameter.position?.endLine,
                                    endColumn: otherClassParameter.position?.endColumn
                                }
                            }

                            related_to_context = related_to_parameter;
                        }
                    }

                    currentParameters[currentClassParameter.key] = {
                        key: currentClassParameter.key,
                        name: currentClassParameter.name,
                        // @ts-ignore
                        type: currentClassParameter.type,
                        displayedType: currentClassParameter.displayedType,
                        probability: commonFieldParameterPairKey.probability,
                        modifiers: currentClassParameter.modifiers,
                        to_variable: related_to_context,
                        position:{
                            startLine: currentClassParameter.position?.startLine,
                            startColumn: currentClassParameter.position?.startColumn,
                            endLine: currentClassParameter.position?.endLine,
                            endColumn: currentClassParameter.position?.endColumn
                        }
                    }
                }
            }


        }
        return [currentParameters, commonFieldParameterKeysAsKey];
    }

    /**
     * In Java also interfaces can have fields, so we need to check if the classOrInterface is a class
     * Therefore this method is not needed, but it is kept for future reference
    public static getClassesDict(softwareProjectDicts: SoftwareProjectDicts){
        let classesOrInterfacesDict: Dictionary<ClassOrInterfaceTypeContext> = softwareProjectDicts.dictClassOrInterface;
        let classesDict: Dictionary<ClassOrInterfaceTypeContext> = {};
        let classOrInterfaceKeys = Object.keys(classesOrInterfacesDict);
        for (let classOrInterfaceKey of classOrInterfaceKeys) {
            let classOrInterface = classesOrInterfacesDict[classOrInterfaceKey];
            let type = classOrInterface.type; // ClassOrInterfaceTypeContext type is either "class" or "interface"
            if(type === "class"){ // DataclumpsInspection.java line 407
                classesDict[classOrInterfaceKey] = classOrInterface;
            }
        }
        return classesDict;
    }
     */

}
