.PHONY: push

push:
	aws s3 sync --cache-control "no-cache" site-root/ s3://cache.queuecontinuum.com/www/http-api.ui/ --delete
