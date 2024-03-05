import { AppBar, Container, MenuItem, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import ExternalLink from "./ExternalLink";
import { RouteDescription, routeDescriptions } from "./NfftHeader";

const linkStyles: React.CSSProperties = {
    color: "inherit",
    textDecoration: "inherit",
}

function NfftMenuItem({route}: {route: RouteDescription}) {
    return (
        <Tooltip title={route.shortDescription}>
            <MenuItem><Link style={{ ...linkStyles }} to={route.to}>{route.shortName || route.name}</Link></MenuItem>
        </Tooltip>
    )
}

export function NifiAppBar() {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters >   
                    <Tooltip title={routeDescriptions.home.shortDescription}>
                        <>
                            {/* <img src="https://nifi.apache.org/assets/images/apache-nifi-logo.svg" height="25px"/> */}
                            <Typography variant="h6" color="inherit" component="div"><Link style={{ color: "inherit", textDecoration: "inherit" }} to="/">Nifi FlowFile Tools</Link></Typography>
                        </>
                    </Tooltip>
                    <div style={{flex: 1}} />
                    <Stack direction="row">
                        <NfftMenuItem route={routeDescriptions.unpackage} />
                        <NfftMenuItem route={routeDescriptions.bulkUnpackage} />
                        <NfftMenuItem route={routeDescriptions.package} />
                        <NfftMenuItem route={routeDescriptions.source} />
                        <Tooltip title="External Apache Nifi Documentation.">
                            <MenuItem><ExternalLink style={{ ...linkStyles }} href="https://nifi.apache.org/docs.html">Nifi Docs</ExternalLink></MenuItem>
                        </Tooltip>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default NifiAppBar;