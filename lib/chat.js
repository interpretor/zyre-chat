/*
 * Copyright (c) 2017 Sebastian Rager
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const readline = require('readline');
const chalk = require('chalk');
const zyre = require('zyre.js');

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

const COLORS = {
  0: 'red',
  1: 'green',
  2: 'yellow',
  3: 'blue',
  4: 'magenta',
  5: 'cyan',
};

function colorString(str) {
  return chalk[COLORS[(str.length + str.charCodeAt(0)) % 6]](str);
}

function addListener(zyreInstance) {
  zyreInstance.on('connect', (id, name, headers) => {
    clearStdin();

    if (typeof headers !== 'undefined' && typeof headers.greeting !== 'undefined') {
      console.log(chalk.dim(`${name} has joined the chat: ${headers.greeting}`));
    } else {
      console.log(chalk.dim(`${name} has joined the chat`));
    }

    rl.prompt(true);
  });

  zyreInstance.on('disconnect', (id, name) => {
    clearStdin();
    console.log(chalk.dim(`${name} has left the chat`));
    rl.prompt(true);
  });

  zyreInstance.on('expired', (id, name) => {
    clearStdin();
    console.log(chalk.dim(`${name} timed out`));
    rl.prompt(true);
  });

  zyreInstance.on('whisper', (id, name, message) => {
    clearStdin();
    console.log(`[${colorString(name)}]: ${message}`);
    rl.prompt(true);
  });

  zyreInstance.on('shout', (id, name, message) => {
    clearStdin();
    console.log(`${colorString(name)}: ${message}`);
    rl.prompt(true);
  });
}

function close(zyreInstance) {
  zyreInstance.stop().then(() => {
    clearStdin();
    process.exit(0);
  });
}

function processInput(input, zyreInstance) {
  const inputArr = input.split(' ');

  switch (inputArr[0].toLowerCase()) {
    case '/list': {
      const peers = zyreInstance.getPeers();

      Object.keys(peers).forEach((i) => {
        const online = peers[i].evasive ? chalk.red('offline') : chalk.green('online');
        console.log(`${peers[i].name} - ${online}`);
      });

      break;
    }

    case '/whisper': {
      const peerName = inputArr[1];
      const message = inputArr.slice(2).join(' ');
      const peers = zyreInstance.getPeers();

      Object.keys(peers).forEach((i) => {
        if (peers[i].name.toLowerCase() === peerName.toLowerCase()) {
          zyreInstance.whisper(i, message);
        }
      });

      break;
    }

    case '/exit':
      close(zyreInstance);
      break;

    case '/help':
      console.log('/list: List all connected clients');
      console.log('/whisper <name> <message>: Send message to a specific client');
      console.log('/exit: Leave chat');
      break;

    default:
      zyreInstance.shout('CHAT', input);
  }
}

function startUp(name, iface, greeting, evasive, expired, binterval) {
  let headers;
  if (typeof greeting !== 'undefined') headers = { greeting };

  const zre = zyre.new({ name, iface, headers, evasive, expired, binterval });

  addListener(zre);

  zre.start().then(() => {
    zre.join('CHAT');
  });

  rl.on('SIGINT', () => {
    close(zre);
  });

  console.log('Type "/help" to get information about available commands');
  rl.prompt();

  rl.on('line', (input) => {
    processInput(input, zre);
    rl.prompt();
  });
}

class Chat {
  static start(name, iface, greeting, evasive, expired, binterval) {
    if (typeof name !== 'undefined') {
      startUp(name, iface, greeting, evasive, expired, binterval);
    } else {
      rl.question('Enter your name: ', (answer) => {
        startUp(answer, iface, greeting, evasive, expired, binterval);
      });
    }
  }
}

module.exports = Chat;
