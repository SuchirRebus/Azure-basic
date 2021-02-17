const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuid} = require("uuid");
const AZURE_CONNECTION_STORAGE_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

const fs = require('fs')
const path = require('path')

//const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STORAGE_STRING);


async function createContainer(containerName){
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STORAGE_STRING);
    console.log("Creating Container ... \n\t"+containerName);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const createContainerResponse = await containerClient.create(containerName);
    console.log("Container is created successfully. Request Id is: "+ createContainerResponse.requestId);
    //return containerClient;
}

async function getContainer(containerName){
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STORAGE_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName)
    console.log("getConainer function is called")
    return containerClient
}

async function createBlob(blobName){
    containerClient = await getContainer('stest1')
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log("\nUploading to Azure storage as blob:\n\t",blobName);
    const data = "This data is a test data"
    const uploadBlobResponse = await blockBlobClient.upload(data,data.length)
    console.log("________________");
    console.log("Blob is uploaded successfully with Request Id: "+uploadBlobResponse.requestId) ;
    //return blockBlobClient;
}


async function getBlob(blobName){
    containerClient = await getContainer('stest1')
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log("getBlob is called")
    return blockBlobClient
}

async function listBlobs(){
    console.log("Listing blobs")
    containerClient = await getContainer('stest1');

    for await(let blob of containerClient.listBlobsFlat()){
        console.log("\t",blob.name)
    }
}

async function downloadBlobs(){
    let blockBlobClient = await getBlob('stext1.txt')
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log("Downloading blob contents...");
    console.log("\t", await streamToString(downloadBlockBlobResponse.readableStreamBody));

}
async function streamToString(readableStream){
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString())
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject)
    })
}

async function deleteContainer(containerName){
    console.log("Deleting Container...");
    clientContainer = await getContainer(containerName);

    const deleteContainerResponse = await clientContainer.delete();
    console.log("Container was deleted successfully. requestId: ", deleteContainerResponse.requestId)
}

async function deleteBlob(blobName){
    console.log("Deleting Blob...");
    blockBlobClient= await getBlob(blobName);

    const deleteBlobResponse = await blockBlobClient.delete();
    console.log("Blob was deleted succesfully. requestId: ", deleteBlobResponse.requestId);
}

async function uploadLocalBlob(){
    clientContainer=await getContainer('stest1');
    filePath='./ltest.txt'
    filePath = path.resolve(filePath);
    fileName = path.basename(filePath)
    console.log('FileName', fileName)
    console.log('filePath: ',filePath)

    blockBlobClient = await clientContainer.getBlockBlobClient(fileName);
    blockBlobClient.uploadFile(filePath)
}

async function main (){
    console.log("Azure Blob storage v12 - JavaScript quickstart sample");
    
    //this is to create blob but i did same code in the function      
//____________________________________________
    // const containerName = "stest3"
    // const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STORAGE_STRING);
    // console.log("Creating Container ... \n\t"+containerName);

    // const containerClient = blobServiceClient.getContainerClient(containerName);
    //const createContainerResponse = await containerClient.create(containerName);
    //console.log("Container is created successfully. Request Id is: "+ createContainerResponse.requestId);

//__________________________________________________

        //this is to upload a blob my makin it and this code is now written in createBlob function
//___________________________________________________
    // containerClient= await createContainer('stest1')

    // const blobName = "stext1.txt"
    // console.log(containerClient)
    // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    

    // console.log('\nUploading to Azure storage as blob:\n\t', blobName);

    // const data = "Hello World!";
    // const uploadBlobResponse = await blockBlobClient.upload(data,data.length);
    // console.log("________________");
    // console.log("Blob is uploaded successfully with Request Id: "+uploadBlobResponse.requestId) ;
//_________________________________________________________________

    await createContainer('stest2')  //Please specify a name

    await createBlob('stext2.txt')      //specify the name of file in string format

    await listBlobs();

    await downloadBlobs();

    
    await deleteContainer('stest2');

    await deleteBlob('stext2.txt')

    await uploadLocalBlob()
    console.log("**********************")
    //console.log(AZURE_CONNECTION_STORAGE_STRING)
}
main().then(() => console.log('Done')).catch((ex) => console.log(ex.message));