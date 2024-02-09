**NOTE: very early exploratory stages / work-in-progress. Expect bugs, unstable/hard-coded behavior, a lack of tests, unclean/uncommented code, etc.**

# Interpogate

A visual tool to interpret and understand PyTorch machine learning models.

https://github.com/freedmand/interpogate/assets/306095/849afa6a-66d4-4009-8a8a-107cfd6345fd

- Displays a graph of model architecture with a WebGL-powered frontend
- Visualization can run in IPython/Jupyter notebooks
- Tool can be run standalone to visualize model runs in real-time via gRPC streaming
  - Supports adding visualization blocks

See https://twitter.com/dylfreed/status/1754023172502847973 for more context / demo videos.

## Running in IPython/Jupyter notebooks

Check out this [Colab notebook](https://colab.research.google.com/drive/13RkYiPb-uDS5-Re4dBcSDHnEcjsluswA?usp=sharing) for an interactive demo of using interpogate, or follow the steps below:

### Setup

```sh
# Install interpogate in your Python environment
python3 -m pip install interpogate
```

### Loading a compatible model/tokenizer

```py
# Load up a transformers model and tokenizer.
# Here we're using GPT2, but you can modify the model_name
# to run with other Huggingface transformers models.
import transformers

model_name = 'openai-community/gpt2'
pipe = transformers.pipeline("text-generation", model=model_name)
model = pipe.model
tokenizer = pipe.tokenizer
```

### Running interpogate

The following commands will display an iframe containing the interpogate visualization after running a forward pass on the specified text:

```py
# Import interpogate
from interpogate import Interpogate

# Create an instance of interpogate and run a forward pass
interp = Interpogate(model, tokenizer)
interp.forward("Hello there, how are you?")

# Visualize the forward pass
from IPython.display import HTML
HTML(interp.get_iframe())
```

## Running standalone version of interpogate

Interpogate can also be run as a standalone application. This mode is useful for visualizing model passes in realtime and adding visualization blocks (experimental; only attention viz works for now).

### Installation

Ensure you have [Docker](https://docs.docker.com/engine/install/) installed.

It is recommended to run the Python backend manually and run Docker for everything else (the frontend and gRPC proxy). But if you like, there are instructions further down on how to run everything in Docker (it's just slower).

To set up Python:

```sh
cd src/python

# Create a virtual environment
python3 -m venv venv
source ./venv/bin/activate

# Install the Python requirements
python3 -m pip install -r requirements.txt
```

### Run

In one terminal tab, spin up the frontend and gRPC proxy server:

```sh
docker compose up
```

In another terminal tab, `cd src/python` and activate the Python virtual env set up above via `source ./venv/bin/activate`. Then, run the Python backend:

```sh
python3 server.py
```

This will launch [GPT2](<[GPT2](https://huggingface.co/openai-community/gpt2)>), downloading the model on the first usage. Once the Python backend says `SERVING AT 50051`, it is loaded.

Finally, visit the frontend application at [localhost:5173](http://localhost:5173/). You should see a model graph and be able to run forward passes.

#### Run with custom models

To run with a custom [Huggingface model](https://huggingface.co/models), you can run `python3 server.py <model_name>`, specifying the Huggingface model path, e.g.

```sh
python3 server.py roneneldan/TinyStories-1Layer-21M
```

### Run everything with Docker

Instead of setting up Python dependencies, you can run the entire pipeline including the Python backend with Docker using a profile:

```sh
docker compose --profile python up
```

The frontend application will launch at [localhost:5173](http://localhost:5173/). You should wait until the Python backend prints that it is `SERVING AT 50051` before loading the frontend.

This is much slower and more brittle, especially on Mac (and especially on [Silicon processors](https://github.com/pytorch/serve/issues/2273)), since PyTorch must run in a single thread.

#### Run Docker setup with custom models

To specify a custom model with the full Docker setup, prepend `MODEL=<hugginface model name>` to the command, e.g.

```sh
MODEL=roneneldan/TinyStories-1Layer-21M docker compose --profile python up
```

## Development

To recompile protocol buffers, run

```sh
docker compose run --rm protoc
```

To rebuild single-file web app, run

```sh
docker compose run --rm frontend-singlefile-build
```

## TODO

- [ ] General code clean-up
- [ ] Documentation/comments
- [ ] Configurable ports / settings
- [ ] More efficient frontend data structure design
- [x] Fully functioning Docker stack
- [x] Python package
- [x] Jupyter/IPython notebook support
- [ ] API for adding hooks/visuals on backend
- [ ] Rethink visualization block design
- [x] Colab demos
- [ ] Support non-text generating models
