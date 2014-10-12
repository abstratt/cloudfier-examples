rm -Rf $1/gen
wget http://localhost/services/generator/demo-cloudfier-examples-$1/platform/mean/mapper/foo -o /dev/null -O generated.zip
unzip -d $1/gen generated.zip
rm generated.zip
