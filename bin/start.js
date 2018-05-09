#! /usr/bin/env node

/*
 * Copyright (c) 2017 Sebastian Rager
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const HELPTEXT =
`Usage: zyre-chat [options]

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
                                  discovery and heartbeating`;

function exit() {
  process.stdout.write(`${HELPTEXT}\n`);
  process.exit(0);
}

let name;
let iface;
let greeting;
let evasive;
let expired;
let binterval;

const userArgv = process.argv.slice(2);
userArgv.forEach((e, i) => {
  let cmd;
  let arg;

  // Got "-" option as argument
  if (e.length === 2 && e.substr(0, 1) === '-') {
    cmd = e.substr(1);
    const argvNext = userArgv[i + 1];
    if (typeof argvNext !== 'undefined' && argvNext.length > 0) arg = argvNext;
  // Got "--" option as argument
  } else if (e.length > 4 && e.substr(0, 2) === '--') {
    const argvArr = e.substr(2).split('=');
    if (argvArr[0].length > 0) cmd = argvArr[0];
    if (argvArr.length === 2 && argvArr[1].length > 0) arg = argvArr[1];
  // Don't handle anything when argument is not an option
  } else {
    return;
  }

  // Handle commands
  switch (cmd) {
    case 'n':
    case 'name':
      if (typeof arg !== 'string') exit();
      name = arg;
      break;

    case 'i':
    case 'iface':
      if (typeof arg !== 'string') exit();
      iface = arg;
      break;

    case 'g':
    case 'greeting':
      if (typeof arg !== 'string') exit();
      greeting = arg;
      break;

    case 'e':
    case 'evasive':
      if (isNaN(+arg)) exit();
      evasive = +arg;
      break;

    case 'E':
    case 'expired':
      if (isNaN(+arg)) exit();
      expired = +arg;
      break;

    case 'b':
    case 'binterval':
      if (isNaN(+arg)) exit();
      binterval = +arg;
      break;

    default:
      exit();
  }
});

const chat = require('../lib/chat');

chat.start({ name, iface, greeting, evasive, expired, binterval });
