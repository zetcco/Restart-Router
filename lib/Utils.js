import { parse } from 'node-html-parser';

export const obj2xml = (obj) => {
    if (Object.keys(obj).length !== 1)
        throw "Object must have only one root element";
    return `<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>${rec_obj2xml(obj)}`
}
const rec_obj2xml = (obj) => {
    return Object.keys(obj).reduce( ( prev, current ) => {
        let out = ( typeof obj[current] !== 'object' ) ? obj[current] : rec_obj2xml(obj[current]);
        return `${prev}<${current}>${out}</${current}>`
    }, "" )
}

export const xml2obj = (xml) => {
    xml = xml.replace(/<\?.*\?>/gm, '')
    xml = xml.replace(/\r?\n/g, "")
    const obj = { }
    rec_xml2obj(obj, parse(xml).firstChild)
    return obj
}
const rec_xml2obj = (parent, element) => {
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        parent[element.rawTagName] = element.childNodes[0].rawText
    } else {
        const obj = {}
        element.childNodes.forEach(elm => rec_xml2obj(obj, elm))
        parent[element.rawTagName] = obj
    }
}