"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
// zooqle.search('silicon valley').then(response => {
//   console.log(1, response)
//   debugger
// })
// zooqle.search('tt2575988').then(response => console.log(2, response.type))
// zooqle.search('silicon valley').then(response => console.log(3, response.type))
// zooqle.search('tt0468569').then(response => console.log(4, response.type))
// zooqle.getData('/misc/tveps.php?show=60573&se=5&ep=1').then(response => {
//   console.log(response)
//   debugger
// })
_1.zooqle.getTorrentData('/batman-the-dark-knight-2008-2160p-x265-10bit-s90-joy-wqipm.html').then(response => {
    console.log(response);
    debugger;
});
