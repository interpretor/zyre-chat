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
  -n <name>,  --name=<name>       set the name of the chat client
  -i <iface>, --iface=<iface>     set the network interface which the chat
                                  client should use
  -g <text>,  --greeting=<text>   set a greeting message that will be sent to
                                  every new connected client
  -e <value>, --evasive=<value>   set the timeout value in ms at which remote
                                  clients will be marked as not responsive and
                                  at which the chat client will force to
                                  reconnect not responding clients
  -E <value>, --expired=<value>   set the timeout value in ms at which remote
                                  clients will be disconnected and removed
  -b <value>, --binterval=<value> set the interval in ms of the UDP broadcast
                                  beacon which is responsible for client
                                  discovery and heartbeating
```
