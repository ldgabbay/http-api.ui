.PHONY: build specs

build:
	aws s3 sync site-root/ s3://docs.pegasussolutions.com/ --delete --exclude '*.json'

specs:
	aws s3 sync site-root/ s3://docs.pegasussolutions.com/ --delete --exclude '*' --include '*.json'
