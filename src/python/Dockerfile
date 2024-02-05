FROM python:3.12.1

ENV HF_HOME=/modelcache

COPY ./requirements.txt /src/python/requirements.txt

WORKDIR /src/python

RUN python3 -m pip install -r requirements.txt --break-system-packages

CMD python3 interpogate.py $MODEL