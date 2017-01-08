.PHONY: build specs

build:
	aws s3 sync --cache-control "no-cache" site-root/ s3://docs.pegasussolutions.com/obscure-ibe/ --delete --exclude '*.json'

specs:
	aws s3 sync --cache-control "no-store" site-root/ s3://docs.pegasussolutions.com/obscure-ibe/ --delete --exclude '*' --include '*.json'
