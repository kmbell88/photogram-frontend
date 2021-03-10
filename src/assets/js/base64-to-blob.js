  // Found this function on stackoverflow to convert base64-to-blob and it works like a charm
  // https://stackoverflow.com/questions/38658654/how-to-convert-a-base64-string-into-a-file/38659875
  
  export default function base64ImageToBlob(str) {
    // extract content type and base64 payload from original string
    let pos = str.indexOf(';base64,');
    let type = str.substring(5, pos);
    let b64 = str.substr(pos + 8);

    // decode base64
    let imageContent = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    let buffer = new ArrayBuffer(imageContent.length);
    let view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for(let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    let blob = new Blob([buffer], { type: type });

    return blob;
  }