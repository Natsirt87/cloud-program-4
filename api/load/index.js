const { BlobServiceClient } = require("@azure/storage-blob");
const fetch = require("node-fetch");
const { TableClient } = require("@azure/data-tables");

const CONNECTION_STRING = process.env.BlobConnectionString;

module.exports = async function (context, req) {
  context.log("Loading data from Dimpsey's link...");
  
  try {
    // Create the BlobServiceClient object with connection string
    const blobService = BlobServiceClient.fromConnectionString(CONNECTION_STRING);

    // Get a reference to the container
    const containerClient = blobService.getContainerClient("dimpsey-test-container");

    // Create a reference to a blob (or object) with the given name in the current container
    const blockBlobClient = containerClient.getBlockBlobClient("dimpFile.txt");

    const dimpsterFile = await (await fetch("https://css490.blob.core.windows.net/lab4/input.txt")).text();

    // Upload the file to the container
    await blockBlobClient.upload(dimpsterFile, dimpsterFile.length);

    // Get a reference to the table that we want to do stuff with
    const tableClient = TableClient.fromConnectionString(CONNECTION_STRING, "DisastrousDimpsterData");

    // Create an array of lines from the file string
    const fileLines = dimpsterFile.trim().split(/\r?\n/);

    //context.log(fileLines)

    for (let line of fileLines) {
      const items = line.trim().split(/\s+/);

      let tableEntity = {};

      // Parse this line to create the table entity
      for (let item of items) {
        if (tableEntity["partitionKey"] == undefined) {
          tableEntity["partitionKey"] = item;
        }
        else if (tableEntity["rowKey"] == undefined) {
          tableEntity["rowKey"] = item;
        }
        else {
          const keyValue = item.split("=");
          tableEntity[keyValue[0]] = keyValue[1];
        }
      }

      // Upload entity to table
      await tableClient.upsertEntity(tableEntity);
    }

    const entitiesItr = tableClient.listEntities();
    let entityList = [];

    for await (entity of entitiesItr) {
      entityList.push(entity);
    }

    context.res.json({
      status: 200,
      body: entityList
    });

  } catch (error) {

    context.res.json({
      status: 500,
      body: "Failed to upload to blob storage: " + error
    });

  }
}