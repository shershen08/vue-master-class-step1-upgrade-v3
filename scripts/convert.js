const fs = require('fs');


const objectToArray = (obj) => Object.keys(obj)

let rawdata = fs.readFileSync('../src/data.json');
let dataSource = JSON.parse(rawdata);

const strs = ['threads.contributors', 'threads.posts', 'forums.threads', 'categories.forums']

strs.forEach(item => {
    const data = item.split('.')
    dataSource[data[0]].map(c => {
        const key = data[1]
        c[key] = c[key] ? objectToArray(c[key]) : c[key]
        return c
    });
})

fs.writeFileSync('../src/data-2.json', JSON.stringify(dataSource));