for app_path in jee/* ; do
    app=${app_path##*/}
	echo "Running tests for - $app"
        echo ./gen.sh jee $app
        echo ./test.sh jee $app -DreportsDirectory=$PWD/test-reports
done
cd -
