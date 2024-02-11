# Interpogate

A visual tool to interpret and understand PyTorch machine learning models.

https://github.com/freedmand/interpogate/assets/306095/afc0a504-90f3-40f4-8d8e-9e302e5d3a89

- Displays a graph of model architecture with a WebGL-powered frontend
- Visualization can run in IPython/Jupyter notebooks
- Intuitive mechanism to attach hooks to models
- Tool can be run standalone to visualize model runs in real-time via gRPC streaming (beta)
  - Supports adding visualization blocks

See https://twitter.com/dylfreed/status/1756543423216030107 for more context / demo videos.

### Demos

- [Simple demo (colab notebook)](https://colab.research.google.com/drive/13RkYiPb-uDS5-Re4dBcSDHnEcjsluswA?usp=sharing)
- [Logit lens demo (colab notebook)](https://colab.research.google.com/drive/1Qy9UpFtlrPlsuVPyDXmMjq3D8JcIdcUa?usp=sharing)

## Running in IPython/Jupyter notebooks

Follow the steps below:

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

The following commands will display an interactive iframe in a Jupyter/colab notebook containing the interpogate visualization after running a forward pass on the specified text:

```py
# Import interpogate
from interpogate import Interpogate

# Create an instance of interpogate and run a forward pass
interp = Interpogate(model, tokenizer)
interp.forward_text("Hello there, how are you?")

# Visualize the forward pass
interp.visualize()
```

You can run interpogate on non-textbased models as well:

```py
interp = Interpogate(model)
interp.forward(**inputs)
```

Interpogate creates paths for each node that can be explored via the interactive visualization. It also provides a convenient API for registering disposable hooks and modifying model behavior:

```py
lm_head = interp.node('lm_head')
norm = interp.node('model.norm')
with interp.hook() as hook:
    def post_hook(model, input, output):
        # output shape: [<1×N×2048>,...]
        # Run the lm head to unembed and get logits
        logits = lm_head(norm(output[0]))[0]
        layer_logits.append(logits)
        pass

    # Register hooks as needed
    for n in range(22):
        hook.post(f"model.layers.{n}", post_hook)

    # Run forward pass
    interp.forward_text("The most fascinating thing is the")
```

More examples can be viewed in the `examples/` [directory](./example/README.md).

## API

### - `Interpogate(model, [tokenizer])`

Create a new instance of interpogate attached to a PyTorch model and an optional tokenizer (if using text-based forward methods)

- `interp.forward(**inputs)`

  Runs a forward pass of the model with the specified `inputs` (same inputs that would be passed to the torch model directly). Records information about the shapes of each model node's input/output.

- `interp.forward_text(text)`

  Requires the interpogate instance to have been initialized with a tokenizer. Runs a forward pass on the specified string of text, using the tokenizer to derive model inputs. Records information about the shapes of each model node's input/output.

- `interp.visualize()`

  Render an iframe containing an interactive visualization of the model architecture. You can use the magic wand tool to display information about model nodes.

- `interp.node(path)`

  Return the model node at the specified path string. To get a model node path, use the `visualize` command and select a node. You can view its path in the displayed table, or click the path to get hook callback code.

- `with interp.hook() as hook: ...`

  Returns an instance of a class that can be used to attach pre- and post-forward pass hooks to the model within a context block.

  - `hook.pre(path, callback_fn)`

    Register a pre-forward pass hook on the specified model node by path that will trigger the callback function (callback function form: `def pre_hook(model, input):`)

  - `hook.post(path, callback_fn)`

    Register a post-forward pass hook on the specified model node by path that will trigger the callback function (callback function form: `def post_hook(model, input, output):`)

## Running standalone version of interpogate

See [the standalone documentation](./standalone.md).

## TODO

- [ ] General code clean-up
- [ ] Documentation/comments
- [ ] Configurable ports / settings
- [ ] More efficient frontend data structure design
- [x] Fully functioning Docker stack
- [x] Python package
- [x] Jupyter/IPython notebook support
- [x] API for adding hooks/visuals on backend
- [ ] Rethink visualization block design
- [x] Colab demos
- [x] Support non-text generating models
