#! /usr/bin/env node

/*
 * Copyright (c) 2017 Sebastian Rager
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const program = require('commander');
const chat = require('../lib/chat');

const version = require('../package.json').version;

program
  .version(version, '-v, --version')
  .option('-n, --name <name>', 'set the name of the chat client')
  .option('-i, --iface <iface>', 'set the network interface or IPv4 address which the chat client should use')
  .option('-g, --greeting <text>', 'set a greeting message that will be sent to every new connected client')
  .option('-e, --evasive <value>', 'set the timeout value in ms at which remote clients will be marked as not responsive and at which the chat client will force to reconnect not responding clients', parseInt)
  .option('-E, --expired <value>', 'set the timeout value in ms at which remote clients will be disconnected and removed', parseInt)
  .option('-p, --port <port>', 'set the TCP port for incoming messages, will be incremented if already in use', parseInt)
  .option('-P, --bport <port>', 'set the UDP port of the broadcast beacon which is responsible for client discovery and heartbeating', parseInt)
  .option('-b, --binterval <value>', 'set the interval in ms of the UDP broadcast beacon which is responsible for client discovery and heartbeating', parseInt)
  .parse(process.argv);

chat.start({
  name: program.name,
  iface: program.iface,
  greeting: program.greeting,
  evasive: program.evasive,
  expired: program.expired,
  port: program.port,
  bport: program.bport,
  binterval: program.binterval,
});
