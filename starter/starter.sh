#!/bin/sh 
      app_name="codeKiss2"
      mkdir $app_name 
      cd $app_name 
      npm init -y
      tsc --init
      data="[express,cors,body-parser]"
      data=${data// /}
 data=${data//,/ }
 data=${data##[}
 data=${data%]}
 eval data=($data)

for pkgs in ${data[@]} 
 do 
 npm i ${pkgs} 
 echo import ${pkgs//-/} from   \"${pkgs}\"   >> index.ts 
 done
cat << EOF >> index.ts

const app = express();
app.get('/', (req, res) => {
    res.send('Well done!');
})
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
 });
EOF
 