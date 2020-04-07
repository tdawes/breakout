SHELL := bash -e -u -o pipefail

GOOGLE_CLOUD_PROJECT ?= $(shell firebase use)
export GOOGLE_CLOUD_PROJECT
$(info GOOGLE_CLOUD_PROJECT = $(GOOGLE_CLOUD_PROJECT))

ROOT := $(realpath .)
FIREBASE := $(ROOT)/node_modules/.bin/firebase
TS_NODE := $(ROOT)/node_modules/.bin/ts-node

.PHONY: connect
connect:
	$(FIREBASE) use '$(GOOGLE_CLOUD_PROJECT)'

.PHONY: migrate
migrate: connect
	TS_NODE_PROJECT=apps/migrator/tsconfig.json $(TS_NODE) apps/migrator/src/index.ts

.PHONY: deploy
deploy: connect
	$(FIREBASE) deploy
