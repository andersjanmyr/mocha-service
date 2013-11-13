
default:
	npm test
	npm run-script jshint

ci:
	npm install
	npm run-script test-ci
	npm run-script jshint-ci

package: ci
	npm pack

clean:
	rm *.tgz


