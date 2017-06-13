#! /usr/bin/env node
const chat = require('../index');

let name;
let iface;

process.argv.slice(2).forEach((e) => {
  const arg = e.split('=');
  if (arg[0] === '--name') name = arg[1];
  if (arg[0] === '--iface') iface = arg[1];
});

chat.start(name, iface);
