.PHONY: build specs

build:
	aws s3 sync . s3://docs.pegasussolutions.com/ --delete --exclude '*.json'

specs:
	aws s3 sync . s3://docs.pegasussolutions.com/ --delete --exclude '*' --include '*.json'