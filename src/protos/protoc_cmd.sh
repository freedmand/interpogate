PY_OUT=../python/proto
JS_OUT=../frontend/src/lib/proto

# Remove output directories if they exist
[ -d "$PY_OUT" ] && rm -rf "$PY_OUT"/*
[ -d "$JS_OUT" ] && rm -rf "$JS_OUT"/*

# Create directories
mkdir -p "$PY_OUT"
mkdir -p "$JS_OUT"

python3 -m grpc_tools.protoc \
  --plugin=protoc-gen-grpc-web=./node_modules/.bin/protoc-gen-grpc-web \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  -Isrc --python_out="$PY_OUT" \
  --pyi_out="$PY_OUT" --grpc_python_out="$PY_OUT" \
  --ts_out="$JS_OUT" \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:"$JS_OUT" \
  src/interpogate.proto
python3 -m protoletariat \
  --create-package \
  --in-place \
  --python-out "$PY_OUT" \
  protoc --protoc-path "python3 $(python3 -c "import grpc_tools.protoc; print(grpc_tools.protoc.__file__)")" --proto-path src src/interpogate.proto