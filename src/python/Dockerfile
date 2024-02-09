FROM python:3.12.1

ENV HF_HOME=/modelcache
ENV IN_DOCKER=True

COPY ./requirements.txt /src/python/requirements.txt

WORKDIR /src/python

RUN python3 -m pip install -r requirements.txt --break-system-packages

CMD python3 server.py $MODEL