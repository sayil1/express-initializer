const express = require("express")
const app = express()
const fs = require('fs');
var cors = require('cors')
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())


const port = process.env.PORT || 3000


app.post('/generate', (req, res) => {

    req.body.packages.forEach(element => {
        // console.log(element.name, "element")

    });

    content = `!/bin/sh \n  mkdir ${req.body.app_name} \n cd ${req.body.app_name} \n npm init -y `
    fs.writeFileSync('test.sh', content);
    req.body.packages.forEach(element => {
        // console.log(element.name, "element")
        packages = `npm i ${element.name}`
        fs.writeFileSync('test.sh', packages);

    });


    console.log(packages, "packages")

})


app.listen(port, () => {
    console.log(`Example app listening at port:${port}`)
})