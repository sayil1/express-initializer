import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
const app = express();

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
    return "data=${data// /}\n data=${data//,/ }\n data=${data##[}\n data=${data%]}\n eval data=($data)\n echo ${data[2]}";
  }

  public runInstallationLoop() {
    return 'for pkgs in "${data[@]}" \n do \n npm i ${pkgs} \n done';
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
     
    
           
     `;
  }
}

app.post("/generate", (req, res) => {
  let content: any = new NpmGenerator(req.body.packages, req.body.app_details);
  //   console.log(content.generate())

  fs.writeFileSync("tester.sh", content.generate());

  //   console.log(packages, "packages");
});

app.listen(port, () => {
  console.log(`Example app listening at port:${port}`);
});
