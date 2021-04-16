# NeosX

[![Build Status](https://travis-ci.org/RoxyBoxxy/NeosX.svg?branch=main)](https://travis-ci.org/RoxyBoxxy/NeosX)

A simple app i am making to see who is on and where in neos without loading up the game

## Security

This tool stores you token and userid into localstorage this means we dont need to save your email and password.

The only time your password and email are sent is to collect your token from the Neos API using https, meaning its encripted from you to Neos.

No 3rd party API modules are used nor any servers.

If you have a security consern feel free to post in the Issues tab


## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/RoxyBoxxy/NeosX.git
# Go into the repository
cd NeosX
# Install dependencies
npm install

cd src/

npm install
# Run the app
npm run dev
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Screen Shots

![alt text](https://img.roxanne.cloud/Zsis.PNG "login Screen")

![alt text](https://img.roxanne.cloud/vYEc.PNG "Main Screen")

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
