const { BlobServiceClient } = require("@azure/storage-blob");
const { TableClient } = require("@azure/data-tables");

const CONNECTION_STRING = process.env.BlobConnectionString;

module.exports = async function (context, req) {
  try {
    // Create the BlobServiceClient object with connection string
    const blobService = BlobServiceClient.fromConnectionString(CONNECTION_STRING);

    // Get a reference to the container
    const containerClient = blobService.getContainerClient("dimpsey-test-container");

    // Create a reference to a blob (or object) with the given name in the current container
    const blockBlobClient = containerClient.getBlockBlobClient("dimpFile.txt");

    // Delete the file
    blockBlobClient.deleteIfExists();

    // Get a reference to the table that we want to do stuff with
    const tableClient = TableClient.fromConnectionString(CONNECTION_STRING, "DisastrousDimpsterData");

    let entitiesItr = tableClient.listEntities();
    
    for await (entity of entitiesItr) {
      tableClient.deleteEntity(entity.partitionKey, entity.rowKey);
    }

    let entityList = [];
    entitiesItr = tableClient.listEntities();
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