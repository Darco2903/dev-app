const { ipcMain } = require("electron");
const { CloudFront } = require("@aws-sdk/client-cloudfront");

const { accessKeyId, secretAccessKey } = require("../../../config/aws.json");

const cloudfront = new CloudFront({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region: "eu-west-3",
});

/**
 * @param {import("@aws-sdk/client-cloudfront").Distribution & import("@aws-sdk/client-cloudfront").DistributionConfig} distribution
 * @returns {import("./cloudfront").Distribution}
 */
function mapDistribution(distribution) {
    return {
        id: distribution.Id,
        enabled: distribution.Enabled,
        status: distribution.Status,
        name: distribution.Comment,
    };
}

ipcMain.handle("listDistributions", async () => {
    return cloudfront.listDistributions().then((data) => data.DistributionList.Items.map(mapDistribution));
});

ipcMain.handle("toggleDistribution", async (event, id, enable) => {
    const { ETag, DistributionConfig } = await cloudfront.getDistributionConfig({ Id: id });

    DistributionConfig.Enabled = enable;

    return cloudfront
        .updateDistribution({
            Id: id,
            IfMatch: ETag,
            DistributionConfig,
        })
        .then((data) => data.Distribution.Status === "InProgress");
});
