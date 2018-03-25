.PHONY: push

push:
	aws s3 sync --cache-control "no-cache" site-root/ s3://www.queuecontinuum.com/http-api/ --delete
