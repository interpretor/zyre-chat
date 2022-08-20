# zyre-chat

Simple chat based on zyre.js

## Installation

```bash
npm install -g zyre-chat
```

## Usage

```
Usage: zyre-chat [options]

Options:

  -v, --version            output the version number
  -n, --name <name>        set the name of the chat client
  -i, --iface <iface>      set the network interface or IPv4 address which the chat client should use
  -g, --greeting <text>    set a greeting message that will be sent to every new connected client
  -e, --evasive <value>    set the timeout value in ms at which remote clients will be marked as not responsive and at which the chat client will force to reconnect not responding clients
  -E, --expired <value>    set the timeout value in ms at which remote clients will be disconnected and removed
  -p, --port <port>        set the TCP port for incoming messages, will be incremented if already in use
  -P, --bport <port>       set the UDP port of the broadcast beacon which is responsible for client discovery and heartbeating
  -b, --binterval <value>  set the interval in ms of the UDP broadcast beacon which is responsible for client discovery and heartbeating
  -h, --help               output usage information
```
