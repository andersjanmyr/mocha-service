
check:
	npm test
	npm run-script jshint

package: default
	npm pack

default: check
