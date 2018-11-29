## Synopsis
This is a sample to generate a pdf on the Flex Service Runtime


## Inputs

```json
    {
      "format": "[raw | base64]" 
    }
```

format - return the payload as a raw string vs base64 encoded. possible values are ```raw``` or ```base64```

## Prerequisites
npm install --save kinvey-flex-sdk pdfkit memory-streams base-64
 
## PDF layout 
see http://pdfkit.org/ on how to generate PDF document
Customer must process input data as per requirment and "render" the pdf

## Other
PDF will be generated in memory. Flex does not have a way of storing files. The file can be sent back to the client app
and uploaded to the files section in a different API call.
