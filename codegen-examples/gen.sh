rm -Rf $1/$2/gen
mkdir -p $1/$2/gen
wget -v -d  http://localhost/services/generator/demo-cloudfier-examples-$2/platform/$1  -O generated.zip
unzip -d $1/$2/gen generated.zip
rm generated.zip
ln -s ../../../node_modules $1/$2/gen/	
