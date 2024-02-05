**NOTE: very early exploratory stages / work-in-progress. Expect bugs, unstable/hard-coded behavior, a lack of tests, unclean/uncommented code, etc.**

# Interpogate

A visual tool to interpret and understand PyTorch machine learning models.

- Displays a graph of model architecture with a WebGL-powered frontend
- Shows model runs in real-time via gRPC streaming
- Supports adding visualization blocks

See https://twitter.com/dylfreed/status/1754023172502847973 for more context / demo videos.

## Run

This project can be run with [Docker](https://www.docker.com/).

Run this command:

```sh
docker compose up
```

Wait until the frontend server is up and `interpogate-python` says `SERVING AT 50051`. Visit http://localhost:5173/ to view the application.

By default, this will launch with the [GPT2](https://huggingface.co/openai-community/gpt2) model. To specify a custom model, prepend `MODEL=<hugginface model name>` to the command, e.g.

```sh
MODEL=roneneldan/TinyStories-1Layer-21M docker compose up
```

(Caution: forward passes may not currently work under Docker but should be fixed soon)

## Development

To recompile protocol buffers, run

```sh
docker compose run protoc
```

## TODO

- [ ] General code clean-up
- [ ] Documentation/comments
- [ ] Configurable ports / settings
- [ ] More efficient frontend data structure design
- [ ] Fully functioning Docker stack
- [ ] Python package
- [ ] Jupyter/IPython notebook support
- [ ] API for adding hooks/visuals on backend
- [ ] Rethink visualization block design
- [ ] Colab demos
- [ ] Support non-text generating models
