/*
 * Copyright (c) 2017 Sebastian Rager
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const readline = require('readline');
const chalk = require('chalk');
const Zyre = require('zyre.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.blue('> '),
});

function clearStdin() {
  if (process.platform !== 'win32') {
    readline.clearLine(process.stdin, 0);
    readline.cursorTo(process.stdin, 0);
  }
}

function print(str) {
  process.stdout.write(`${str}\n`);
}

const colorStringStore = {};

function colorString(str) {
  if (colorStringStore.hasOwnProperty(str)) return colorStringStore[str];

  let rndnr = 0;

  for(i = 0; i < str.length; i+=1) {
    rndnr += str.charCodeAt(i);
  }

  rndnr = rndnr % 230;

  if (rndnr < 17) rndnr += 16;

  colorStringStore[str] = chalk.ansi256(rndnr)(str)

  return colorStringStore[str];
}

function addListener(zyre) {
  zyre.on('connect', (id, name, headers) => {
    clearStdin();

    if (typeof headers !== 'undefined' && typeof headers.greeting !== 'undefined') {
      print(chalk.dim(`${name} has joined the chat: ${headers.greeting}`));
    } else {
      print(chalk.dim(`${name} has joined the chat`));
    }

    rl.prompt(true);
  });

  zyre.on('disconnect', (id, name) => {
    clearStdin();
    print(chalk.dim(`${name} has left the chat`));
    rl.prompt(true);
  });

  zyre.on('expired', (id, name) => {
    clearStdin();
    print(chalk.dim(`${name} timed out`));
    rl.prompt(true);
  });

  zyre.on('whisper', (id, name, message) => {
    clearStdin();
    print(`[${colorString(name)}]: ${message}`);
    rl.prompt(true);
  });

  zyre.on('shout', (id, name, message, group) => {
    if (group === 'CHAT') {
      clearStdin();
      print(`${colorString(name)}: ${message}`);
      rl.prompt(true);
    }
  });
}

function close(zyre) {
  zyre.stop().then(() => {
    clearStdin();
    process.exit(0);
  });
}

function processInput(input, zyre) {
  const inputArr = input.split(' ');

  switch (inputArr[0].toLowerCase()) {
    case '/list': {
      const peers = zyre.getPeers();

      Object.keys(peers).forEach((i) => {
        const online = peers[i].evasive ? chalk.red('offline') : chalk.green('online');
        print(`${colorString(peers[i].name)} - ${online}`);
      });

      break;
    }

    case '/whisper': {
      const peerName = inputArr[1];
      const message = inputArr.slice(2).join(' ');
      const peers = zyre.getPeers();

      Object.keys(peers).forEach((i) => {
        if (peers[i].name.toLowerCase() === peerName.toLowerCase()) {
          zyre.whisper(i, message);
        }
      });

      break;
    }

    case '/exit':
      close(zyre);
      break;

    case '/help':
      print('/list: List all connected clients');
      print('/whisper <name> <message>: Send message to a specific client');
      print('/exit: Leave chat');
      break;

    default:
      zyre.shout('CHAT', input);
  }
}

class Chat {
  static start({ name, iface, greeting, evasive, expired, port, bport, binterval } = {}) {
    let headers;
    if (typeof greeting !== 'undefined') headers = { greeting };

    const zyre = new Zyre({ name, iface, headers, evasive, expired, port, bport, binterval });

    addListener(zyre);

    zyre.start().then(() => {
      zyre.join('CHAT');
    });

    rl.on('SIGINT', () => {
      close(zyre);
    });

    rl.on('line', (input) => {
      processInput(input, zyre);
      rl.prompt();
    });

    print('Type "/help" to get information about available commands');
    rl.prompt();
  }
}

module.exports = Chat;
