export { 
    InputStream,
    packageFlowFiles,
    unpackageFlowFiles,
    CORE_ATTRIBUTES,
    NF2T_ATTRIBUTES,
    FLOWFILE_MEDIA_TYPES,
    FLOWFILE_EXTENSION,
    FLOWFILE_ATTRIBUTES_EXTENSION,
    MAGIC_HEADER,
    isCoreAttribute,
    getCoreAttribute,
    isNf2tAttribute,
    getNf2tAttribute,
    findCoreAttributes,
    updateNf2tAttributes,
} from "@nf2t/flowfiletools-js";

export type {
    CoreAttributeNames,
    AttributeSpecification,
    AttributeSpecifications,
    Nf2tAttributeNames,
    FlowFileAttribute,
    FlowFileAttributes,
    FlowFileContent,
    FlowFile,
    CoreFlowFileAttributes,
} from "@nf2t/flowfiletools-js";