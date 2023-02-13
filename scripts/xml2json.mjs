import * as fs from 'fs';
import * as convert from 'xml-js';

var xml = fs.readFileSync('./public/intel_intrinsics.xml', 'utf8');

var result = convert.xml2json(xml, { compact: true, spaces: 4 }).replace(/\r\n/g, '');
let intrinsics = JSON.parse(result).intrinsics_list.intrinsic;

const recur_flatten = obj => {
    if (obj._text) return obj._text;
    if (!obj._attributes) return obj;
    const flattened = { ...obj._attributes };
    delete obj._attributes
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            flattened[key] = obj[key].map(elem => recur_flatten(elem))
        } else {
            flattened[key] = recur_flatten(obj[key]);
        }
    }
    return flattened;
}

const flattened_intrinsics_list = intrinsics.map(intrin => {
    return recur_flatten(intrin);
})

console.log(flattened_intrinsics_list[0])

fs.writeFileSync('./public/intel_intrinsics.json', JSON.stringify(flattened_intrinsics_list, null, 2), 'utf8');


const types = new Set();

intrinsics.forEach(element => {

    // Read the input parameters
    if (element.parameter != undefined) {
        if (!Array.isArray(element.parameter)) {
            element.parameter = [element.parameter]
        }
        element.parameter.forEach(e => {
            types.add(e.type);
        });
    }

    // Read the 
});

// console.log(types)