# Interpogate proxy

An [Envoy proxy](https://www.envoyproxy.io/) configuration so the frontend can communicate to the Python grpc server.

## Non-Docker usage

[Install Envoy](https://www.envoyproxy.io/docs/envoy/latest/start/install) and then run it with the following command in this directory:

```sh
envoy -c envoy.yaml
```

Logs will be written to the `./logs` directory.
