import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
const path = require("path");
const app = express();
const admz = require("adm-zip");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

const port = process.env.PORT || 3000;

abstract class Generator {
  _packages: any = [];
  _app_details: any = {};

  constructor(public packages: any[], public app_details) {
    this._packages = packages;
    this._app_details = app_details;
  }
}

class NpmGenerator extends Generator {
  constructor(public packages: any[], app_details) {
    super(packages, app_details);
  }

  public convertTsArrayTo() {
    return "data=${data// /}\n data=${data//,/ }\n data=${data##[}\n data=${data%]}\n eval data=($data)\n";
  }

  public runInstallationLoop() {
    return 'for pkgs in ${data[@]} \n do \n npm i ${pkgs} \n echo import ${pkgs//-/} from   \\"${pkgs}\\"   >> index.ts \n done';
  }

  pkgs: string[] = [];
  public generate() {
    this.packages.forEach((element) => {
      this.pkgs.push(element.name);
      console.log(element.name);
    });

    //            npm install typescript ts-node @types/node @types/express --save-dev
    // for NUM in ${this.pkgs}
    //    do
    //      npm i $NUM
    //    done

    return `#!/bin/sh 
      app_name="${this.app_details.app_name}"
      mkdir $app_name 
      cd $app_name 
      npm init -y
      data="[${this.pkgs}]"
      ${this.convertTsArrayTo()}
${this.runInstallationLoop()}
cat << EOF >> index.ts

const app = express();
app.get('/', (req, res) => {
    res.send('Well done!');
})
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
 });
EOF
 `;
  }
}
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.post("/generate", async (req, res, next) => {
  try {
    let content: any = await new NpmGenerator(
      req.body.packages,
      req.body.app_details
    );
    fs.mkdirSync("starter");
    await fs.writeFileSync("starter/starter.sh", content.generate());
    res.send({
      error: false,
      message: "file generated",
    });
  } catch (error) {
    res.send({
      error: true,
      message: "file already generated",
    });
  }

  // var to_zip = fs.readdirSync(__dirname + "/" + "starter");
  // var zp = new admz();
  // for (var k = 0; k < to_zip.length; k++) {
  //   zp.addLocalFile(__dirname + "/" + "starter" + "/" + to_zip[k]);
  // }
  // const file_after_download = "downloaded_file.zip";
  // const data = zp.toBuffer();
  // res.set("Content-Type", "application/octet-stream");
  // res.set("Content-Disposition", `attachment; filename=${file_after_download}`);
  // res.set("Content-Length", data.length);
});

app.get("/download", (req, res, next) => {
  fs.access(__dirname + "/" + "starter", error => {
    if (!error) {
        // The check succeeded
        res.send("found")
    } else {
        // The check failed
        res.send("not found")


    }
});


    // var to_zip = fs.readdirSync(__dirname + "/" + "starter");
    // var zp = new admz();
    // for (var k = 0; k < to_zip.length; k++) {
    //   zp.addLocalFile(__dirname + "/" + "starter" + "/" + to_zip[k]);
    // }
    // const file_after_download = "downloaded_file.zip";
    // const data = zp.toBuffer();
    // res.set("Content-Type", "application/octet-stream");
    // res.set(
    //   "Content-Disposition",
    //   `attachment; filename=${file_after_download}`
    // );
    // res.set("Content-Length", data.length);
    // res.send({
    //   error: false,
    //   message: "file downloading",
    // });
  
});

app.listen(port, () => {
  console.log(`Example app listening at port:${port}`);
});
