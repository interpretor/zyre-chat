/*
 * Copyright (c) 2017 Sebastian Rager
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const readline = require('readline');
const zyre = require('zyre.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

function clearStdin() {
  if (process.platform !== 'win32') {
    readline.clearLine(process.stdin, 0);
    readline.cursorTo(process.stdin, 0);
  }
}

class Chat {
  static start() {
    rl.question('Enter your name: ', (answer) => {
      console.log('Type "/help" to get information about available commands');

      const z1 = zyre.new({ name: answer });

      z1.on('connect', (id, name) => {
        clearStdin();
        console.log(`${name} has joined the chat`);
        rl.prompt(true);
      });

      z1.on('disconnect', (id, name) => {
        clearStdin();
        console.log(`${name} has left the chat`);
        rl.prompt(true);
      });

      z1.on('evasive', (id, name) => {
        clearStdin();
        console.log(`${name} not responding`);
        rl.prompt(true);
      });

      z1.on('expired', (id, name) => {
        clearStdin();
        console.log(`${name} timed out`);
        rl.prompt(true);
      });

      z1.on('message', (id, name, message) => {
        clearStdin();
        console.log(`<${name}> ${message}`);
        rl.prompt(true);
      });

      z1.start().then(() => {
        z1.join('CHAT');
      });

      function close() {
        z1.stop().then(() => {
          clearStdin();
          process.exit(0);
        });
      }

      rl.on('SIGINT', close);

      rl.prompt();
      rl.on('line', (input) => {
        const inputArr = input.split(' ');

        switch (inputArr[0]) {
          case '/list': {
            const peers = z1.getPeers();
            for (const i in peers) {
              if ({}.hasOwnProperty.call(peers, i)) {
                console.log(`${peers[i].name}`);
              }
            }

            break;
          }

          case '/whisper': {
            const peerName = inputArr[1];
            const message = inputArr.slice(2).join(' ');
            const peers = z1.getPeers();
            for (const i in peers) {
              if ({}.hasOwnProperty.call(peers, i)) {
                if (peers[i].name === peerName) {
                  z1.whisper(i, message);
                }
              }
            }

            break;
          }

          case '/exit':
            close();
            break;

          case '/help':
            console.log('Available commands:');
            console.log('/list: List all connected clients');
            console.log('/whisper <name> <message>: Send message to a specific client');
            console.log('/exit: Leave chat');
            break;

          default:
            z1.shout('CHAT', input);
        }

        rl.prompt();
      });
    });
  }
}

module.exports = Chat;
