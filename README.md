#NodeCEE

A node based implementation of the CEE interface (a replacement for pixel pulse)

##Why?  PixelPulse is slick

It sure is.  The problem with the pixelpulse model is that it is not DAQ safe, that is

1) It doesn't allow logging (yet)
2) If the browser closes, the data stops logging

NodeCEE creates a framework for MVC treatment of the node, where data can be selectively logged to a database and data acquisition persists whether or not the browser is open.  

##What it does now

Not much.  It will connect to nonolith-connect and interact with the CEE through an ugly debug window.  

##What it will do

- A slick plotting interface (probably not pixel pulse slick, but flot pratical)
- Log to mongo
- Allow scripted events

##How to run

- Start nonolith-connect
- run node expressserver.js
- go to http://localhost:4000


##What it might need
If node farts on you, try:

- npm install express
- npm install socket.io
- npm install faye-websocket