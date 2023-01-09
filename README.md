<p align="center" style="text-align:center;">
  <img alt="Forter Logo" src="docs/assets/logo.png" width="499" />
</p>

This challenge demonstrates a simple API which purpose is to provide the country name associated
with an IP address. The server exposes a lookup endpoint that rely on multiple vendors to provide
the location of an IP.

Requirements & Capabilities:

* **Given an IP address, return the associated country name**

* **Support multiple vendors** (ex.: https://ipstack.com/)

* **Naive cache for IP addresses previously requested**

* **Global configurable rate limits of the server per vendor per hour**

_If the rate limit of one vendor has exceeded, the API fallback to other vendor(s). If the result is not in cache
and the rate limit is exceeded for all vendors, it returns an error message._


Quick Start
---

#### Requirements

* Node.js >= v16.0.0
* [Yarn](https://classic.yarnpkg.com/)
* [Docker](https://docs.docker.com/get-docker/)

```bash
# Clone repository
$ git clone https://github.com/danielnegri/forter-challenge.git 

# Install dependencies
$ yarn install

# Make sure to edit and include the API keys (dotenv)
$ cp .env.example .env
```

#### Running the server in development

```bash
$ yarn start
```

#### Running the server with Docker (Compose)

```bash
$ docker-compose up 
```

#### Local Development

```bash
# Start (nodemon)
$ yarn dev

# Testing with a random IP
$ curl http://localhost:3000?ip=109.207.79.75
{"country_name":"Israel"}
```

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details on submitting patches and the contribution workflow.

### License

This repository is under the AGPL 3.0 license. See the [LICENSE](LICENSE) file for details.
