import * as fs from 'fs';
import * as convert from 'xml-js';

var xml = fs.readFileSync('./public/intel_intrinsics.xml', 'utf8');

var result = convert.xml2json(xml, { compact: true, spaces: 4 }).replace(/\r\n/g, '');
let intrinsics = JSON.parse(result).intrinsics_list.intrinsic;

fs.writeFileSync('./public/intel_intrinsics.json', JSON.stringify(intrinsics, null, 2), 'utf8');

const types = new Set();

intrinsics.forEach(element => {

    // Read the input parameters
    if (element.parameter != undefined) {
        if (!Array.isArray(element.parameter)) {
            element.parameter = [element.parameter]
        }
        element.parameter.forEach(e => {
            types.add(e._attributes.type);
        });
    }

    // Read the 
});

console.log(types)