#!/bin/sh 
      app_name="sayil"
      mkdir $app_name 
      cd $app_name 
      npm init -y
      data="[express,cors,body-parser,Mongo]"
      data=${data// /}
 data=${data//,/ }
 data=${data##[}
 data=${data%]}
 eval data=($data)
 echo ${data[2]}
for pkgs in "${data[@]}" 
 do 
 echo ${pkgs} 
 done
     
    
           
     