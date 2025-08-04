/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

function parseServerVersion(versionString) {
    const snapshot = versionString.includes("SNAPSHOT");
    const cleanedVersion = versionString.replace("-SNAPSHOT", "");
    const [majorStr, minorStr, patchStr = "0"] = cleanedVersion.split(".");
    
    return {
        major: parseInt(majorStr, 10),
        minor: parseInt(minorStr, 10),
        patch: parseInt(patchStr, 10),
        snapshot
    };
}

async function shouldLoadLegacyHeaderBar(d2) {
    try {
        const response = await d2.Api.getApi().get('system/info', { fields: 'version' });
        const versionInfo = parseServerVersion(response.version || "0.0.0");
        return versionInfo.minor < 42;
    } catch (error) {
        console.error("Error fetching server version:", error);
        return true;
    }
}

export async function loadLegacyHeaderBarIfNeeded(d2) {
    const shouldLoad = await shouldLoadLegacyHeaderBar(d2);
    return shouldLoad;
}

export { shouldLoadLegacyHeaderBar };
