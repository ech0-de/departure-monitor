# departure-monitor

<img align="right" width="200" src="http://ech0.de/img/departure-monitor.png">

A distributed departure monitor using html5, angularjs and socket.io. The
monitor connects to a json formatted gtfs feed and displays departures in a
simple and responsive web interface.

This software was developed to display live departure times at ulm university,
since the local transit company does not provide a DPI (Dynamic Passenger
Information) at our university. But the SWU provides a xml feed with realtime
information for all stops and service disruption informations, which are used
for this departure monitor.

## Install

```sh
$ git clone https://github.com/0x530302/departure-monitor
$ cd departure-monitor
$ npm install
```

## Usage

Start the server and open the indicated URL with your favorite browser.

```sh
$ npm start
```

## Libraries

 * [node.js](http://nodejs.org/)
 * [socket.io](http://socket.io/)
 * [angularjs](http://angularjs.org/)
 * [normalize](http://necolas.github.io/normalize.css/)

## License

  Licensed under the MIT License

  Copyright (c) 2014 Dominik Meißner <http://ech0.de/>

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
