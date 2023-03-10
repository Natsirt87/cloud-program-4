const { odata, TableClient } = require("@azure/data-tables");

const CONNECTION_STRING = process.env.BlobConnectionString;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { firstName, lastName } = req.query;

    try {
        // Get a reference to the table that we want to do stuff with
        const tableClient = TableClient.fromConnectionString(CONNECTION_STRING, "DisastrousDimpsterData");

        let query;

        if (firstName && lastName) {
            query = odata`PartitionKey eq ${firstName} and RowKey eq ${lastName}`;
        }
        else if (firstName) {
            query = odata`PartitionKey eq ${firstName}`
        }
        else if (lastName) {
            query = odata`RowKey eq ${lastName}`;
        }

        const listResults = tableClient.listEntities({
            queryOptions: { filter: query }
        });

        let resultEntities = [];
        for await (entity of listResults) {
            resultEntities.push(entity);
        }

        context.res.json({
            status: 200,
            headers: {"Content-Type": "application/json"},
            body: resultEntities
        });

    } catch (error) {
        context.res.json({
            status: 500,
            body: "Failed to query: " + error
        });
    }
}