# simple-json-pack
Pack and unpack JSON files

## Introduction

A quick search on NPM reveals lots of JSON compression related projects. Each with different trade-offs.  This compressor has the following goals:

* The code is simple to use, understand and simple to add to your own projects. This simplity allows for creating simple client decoders in languages other than JavaScript.
* Compressed JSON files remain JSON compatible on output

## How it works

Simple JSON Pack works by scanning a JSON file and creating a tokenization dictionary. The dictionary is then embedded in the output (packed) JSON so its availble for use by another decoder.

This approach offers the opportunty of removing the dictionary from the target JSON output, whereby further reducing the file size. In this use case you would just have the dictionary available on the receiving end. This allows for smaller payloads in storage and transmission.  This is completly optional - but possible.

## Command line

There's an included command line program called `sjp`.  If you'd like to use the code directly in your own projects then just use the `simple-json-pack.js`. The `sjp` serves as a working example.

#### Help options

```
$ ./sjp.js --help
SJP - Simple JSON Pack, ver 1.0
Usage: sjp [options]

Options:
  -p, --pack           perform packing
  -u, --unpack         perform unpacking
  -i, --input <file>   input filename
  -o, --output <file>  output filename
  -h, --help           output usage information
```

#### Compress (pack)

Use the -p option with the -i option to specify a file:

```shell
$ ./sjp.js -p -i ./tests/game.json
SJP - Simple JSON Pack, ver 1.0
./tests/game.json file size in bytes: 24110
./tests/game.json.out file size in bytes: 12379
resulting compression: 49%
```

```shell
$ ./sjp.js -p -i ./tests/github.json
SJP - Simple JSON Pack, ver 1.0
./tests/github.json file size in bytes: 71547
./tests/github.json.out file size in bytes: 48165
resulting compression: 33%
```
