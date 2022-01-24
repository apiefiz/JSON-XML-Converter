
/********************************************************/
/********	DATA CONVERSIONS
/********************************************************/
function jsonToXMLString(json, rootElement) {
  if (rootElement) {
    var bldrOpts = {
      headless: true,
      rootName: rootElement,
      renderOpts: {
        pretty: true,
        indent: "    ",
        newline: "\r\n",
        cdata: true,
      },
    };
  } else {
    var bldrOpts = {
      headless: true,
      renderOpts: {
        pretty: true,
        indent: "    ",
        newline: "\r\n",
        cdata: true,
      },
    };
  }
  return new xml2js.Builder(bldrOpts).buildObject(json);
}

function jsonArrayToXMLBuffer(jsonArray, elementName) {
  /* holds the buffers */
  var buffers = [];

  /* conver each element to an xml buffer */
  for (var i in jsonArray) {
    /* convert it to xml */
    var xmlString = jsonToXMLString(jsonArray[i], elementName);
    /* convert it to a buffer */
    var b = Buffer.from(xmlString + "\n", "utf8");
    /* add to buffers array */
    buffers.push(b);
  }

  /* concat to one giant buffer */
  return Buffer.concat(buffers);
}

function generateXMLBuffer(data, elementName) {
  var start = Buffer.from(
    "<?xml version='1.0' encoding='UTF-8'?> \n <Records>\n",
    "utf8"
  );
  var xmlData = jsonArrayToXMLBuffer(data, elementName);
  var end = Buffer.from("</Records>\n", "utf8");
  var b = Buffer.concat([start, xmlData, end]);
  return b;
}

function encodeText(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\r/g, " ")
    .replace(/\\/g, "\\\\");
}
