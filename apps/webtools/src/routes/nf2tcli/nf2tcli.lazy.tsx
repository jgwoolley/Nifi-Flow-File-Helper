import ExternalLink from "../../components/ExternalLink";
import Nf2tHeader from "../../components/Nf2tHeader";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/nf2tcli")({
    component: BuildProcess,
})

export default function BuildProcess() {
    return (
        <>
            <Nf2tHeader to="/nf2tcli" />
            
            <p><ExternalLink href={"https://jgwoolley.github.io/nf2t-cli/"}>The CLI is avaliable here</ExternalLink>.</p>
        </>
    );
}