import { Button, ButtonGroup } from '@mui/material';
import { useCallback, useMemo } from 'react';
import AttributesTable from '../../components/AttributesTable';
import AttributeDownload from '../../components/AttributeDownload';
import Nf2tHeader from '../../components/Nf2tHeader';
import Nf2tSnackbar from "../../components/Nf2tSnackbar";
import { Nf2tSnackbarProps, useNf2tSnackbar } from "../../hooks/useNf2tSnackbar";
import { Download, SyncProblem } from '@mui/icons-material';
import { Link, createLazyRoute, getRouteApi } from '@tanstack/react-router';
import Nf2tTable from '../../components/Nf2tTable';
import { useNf2tTable } from '../../hooks/useNf2tTable';
import { useNf2tContext } from '../../hooks/useNf2tContext';
import { findCoreAttributes, FlowFileResult } from '@nf2t/flowfiletools-js';
import { downloadFile } from '../../utils/downloadFile';
import useArrayElements from '../../hooks/useArrayElement';
import { Link as MuiLink } from "@mui/material";
import UnpackageLink from './UnpackageLink';

export const Route = createLazyRoute("/unpackageFlowFileLookup")({
    component: UnpackageFlowFile,
})

interface ContentDownloadButtonProps extends Nf2tSnackbarProps {
    flowFile: FlowFileResult,
}

function ContentDownloadButton({ flowFile, submitSnackbarMessage }: ContentDownloadButtonProps) {
    const onClick = useCallback(() => {
        if (flowFile?.status !== "success") {
            submitSnackbarMessage("No content to download.", "error");
            return;
        }
        if (flowFile?.content == undefined) {
            submitSnackbarMessage("No content to download.", "error");
            return;
        }

        const coreAttributes = findCoreAttributes(flowFile.attributes);

        downloadFile(new File([flowFile.content], coreAttributes.filename || ""));
    }, [flowFile, submitSnackbarMessage]);

    return (
        <Button startIcon={flowFile.status === "success" ? <Download /> : <SyncProblem />} variant="outlined" onClick={onClick}>Download Content</Button>
    )
}

const routeId = "/unpackageFlowFileLookup" as const;
const route = getRouteApi(routeId);

export default function UnpackageFlowFile() {
    const snackbarResults = useNf2tSnackbar();

    const searchParams = route.useSearch();

    const { queryResults, unpackagedRows, setUnpackagedRows } = useNf2tContext();

    const { value: flowFile, setValue: setFlowFile } = useArrayElements<FlowFileResult>({
        defaultValue: { status: "error", parentId: "none", error: "No Value" },
        index: searchParams.index,
        values: unpackagedRows,
        setValues: setUnpackagedRows,
    });

    const evaluatedProcessors = useMemo(() => {
        if (!queryResults.data || flowFile == undefined) {
            return [];
        }

        const flowFileAttributes = new Set<string>();
        if (flowFile.status !== "success") return [];
        for (const row of flowFile.attributes) {
            flowFileAttributes.add(row[0]);
        }

        const results = new Map<string, [number, number]>();

        for (const attribute of queryResults.data.attributes) {
            let result = results.get(attribute.extensionId);
            if (result == undefined) {
                result = [0, 0];
                results.set(attribute.extensionId, result);
            }

            result[0] += 1;

            if (attribute.type === "writes") {
                for (const localAttribute of flowFileAttributes) {
                    if (attribute.name === localAttribute) {
                        result[1] += 1;
                    }
                }
            }
        }

        return Array.from(results.entries()).filter(x => x[1][1] > 0).map(x => {
            return {
                extensionId: x[0],
                total: x[1][0],
                sameCount: x[1][1],
                matchPercent: (x[1][1]) / (x[1][0]),
            }
        });
    }, [flowFile, queryResults.data]);

    const tableProps = useNf2tTable({
        childProps: undefined,
        snackbarProps: snackbarResults,
        rows: evaluatedProcessors,
        columns: [
            {
                columnName: 'Extension Id',
                bodyRow: ({ row }) => <Link to="/extensionLookup" search={{ name: row.extensionId }}><MuiLink component="span">{row.extensionId}</MuiLink></Link>,
                rowToString: (row) => row.extensionId,
            },
            {
                columnName: 'Count',
                bodyRow: ({ row }) => <>{Math.round(row.matchPercent * 100)}% ({row.sameCount}/{row.total})</>,
                rowToString: (row) => row.matchPercent.toString(),
                compareFn: (a, b) => a.matchPercent - b.matchPercent,
                defaultSortDirection: "desc",
            },
        ],
        canEditColumn: false,
    });

    return (
        <>
            <Nf2tHeader to={routeId} />

            <p><UnpackageLink /></p>

            {flowFile.status === "success" ? (
                <>
                    <h5>1. Packaged FlowFile</h5>
                    <h5>2. Unpackaged FlowFile Attributes</h5>
                    <p>Download FlowFile Attributes.</p>
                    <AttributesTable
                        {...snackbarResults}
                        flowFile={flowFile}
                        setFlowFile={setFlowFile}
                        canEdit={false}
                    />
                    
                    <ButtonGroup>
                        <AttributeDownload
                            {...snackbarResults}
                            flowFile={flowFile}
                        />
                        <ContentDownloadButton {...snackbarResults} flowFile={flowFile} />
                    </ButtonGroup>

                    <h5>3. Possible Processors</h5>
                    <p>These are processors which might have updated this FlowFile.</p>
                    <Nf2tTable {...tableProps} />
                </>
            ) : <p>No content found.</p>}

            <Nf2tSnackbar {...snackbarResults} />
        </>
    )
}