FROM python:3.12.1

COPY requirements.txt package.json /src/workdir/
WORKDIR /src/workdir

RUN apt-get update && apt-get -y install npm && \
    python3 -m pip install -r requirements.txt --break-system-packages && \
    npm i

CMD sh ./protoc_cmd.sh