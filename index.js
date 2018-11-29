
/**
 * sample to generate a pdf
 * inputs: 
 *      format: return the payload as a raw string vs base64 encoded (*raw/base64)
 *  prerequisites:
 * npm install --save kinvey-flex-sdk pdfkit memory-streams base-64
 * see http://pdfkit.org/ on how to generate PDF document
 * customer must process input data as per requirment and "render" the pdf
 */
const sdk = require('kinvey-flex-sdk');
const PDFDocument = require('pdfkit');
const ms = require('memory-streams');
const b64 = require('base-64');
sdk.service((err, flex) => {
    if(err){
        console.log("could not initialize flex!");
        return;
    }
    let f = flex.functions;
    f.register('generate', function(context, complete, modules){
        let requestBody = context.body;
        if(requestBody == null) {
            return complete().setBody({ "error": "must provide payload to convert"}).badRequest().done();
        }
        let doc = new PDFDocument();
        if(doc == null){
            return complete().setBody({ "error": "could not instantiate pdf document"}).runtimeError().done();  
        }
        
        /** process the document here  */
        let lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.'
        doc.fontSize(8);
        doc.text('This text is left aligned. ' + lorem, {
            width: 410,
            align: 'left'
        });

        doc.moveDown();
        doc.text('This text is left aligned. ' + lorem, {
            width: 410,
            align: 'center'
        });
        doc.moveDown();
        doc.text('This text is justified. ' + lorem, {
            width: 410,
            align: 'justify'
        });
            
        doc.rect(doc.x, 0, 410, doc.y).stroke();
        doc.end();
        /** end processing the document  */

        let responseStream =  new ms.WritableStream();
        let stream = doc.pipe(responseStream);
        stream.on('finish', function(){
            let pdfBytes = stream.toString();
            if(requestBody.format === undefined){
                requestBody.format = "raw";
            }
            if(requestBody.format === "raw") {
              return complete().setBody({"PDFBytes": pdfBytes}).ok().done();
            }
            else if(requestBody.format === "base64"){
              var encoded = Buffer.from(pdfBytes).toString('base64')
              return complete().setBody({"PDFBytes": encoded}).ok().done();
            } else {
                return complete().setBody({"error": "the format '" + requestBody.format + "' is unsupported!"}).badRequest().done();
            }

        });
    });
});

