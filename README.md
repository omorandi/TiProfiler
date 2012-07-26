#Titanium Profiler (iOS)
This project provides a web interface for interacting with a custom extension to the Titanium Mobile framework allowing to profile Ti Mobile applications running in the iOS simulator.

The whole system is based on the following components:

1. [A custom version of the 2.1.0.GA Titanium SDK](https://s3.amazonaws.com/titaniumninja/tiprofiler/2.1.0.GA-profiler.zip) used to build and execute the Titanium Mobile application to be profiled (md5 hash of the zip file: 06c2133c753ba0cda62cac603552dbaa)
2. A node.js server component (tiprofiler)
3. A client web application providing a UI for interacting with the profiler and extracting profiling data

The following video showcases the basic interaction between such three components:

<iframe src="http://player.vimeo.com/video/46148981" width="500" height="313" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe> <p><a href="http://vimeo.com/46148981">TiProfiler demo</a> from <a href="http://vimeo.com/user8368459">Olivier Morandi</a> on <a href="http://vimeo.com">Vimeo</a>.</p>


## Installation
### Custom Ti SDK Installation (2.1.0.GA-profiler)

Download [this package](https://s3.amazonaws.com/titaniumninja/tiprofiler/2.1.0.GA-profiler.zip) and install it in you Titanium SDK `mobilesdk` directory. Such directory should be one of the following:

	* /Library/Application\ Support/Titanium/mobilesdk/osx/
	* ${HOME}/Library/Application\ Support/Titanium/mobilesdk/osx/

There you should find your standard Titanium SDK installs (e.g. 2.0.1.GA2, 2.1.0.GA, etc.). Extract the content of the above package there, so that the contents of the SDK directory would look like (depending on the actual versions of the sdk installed in your system):

	$ ls /Library/Application\ Support/Titanium/mobilesdk/osx/
	
	  2.0.1.GA
	  2.0.1.GA2
	  2.1.0.GA
	  2.1.0.GA-profiler
	 
The custom SDK package is essentially identical to the official 2.1.0.GA one, except that it contains a modified version of the TiJSCore library (`libTicore.a`), and the default Xcode application project has been modified in order to link the Security framework from iOS. For some hints on the modifications required by the TiJSCore library in order to enable the profiling of Titanium JavaScript applications you can check out [this post](http://titaniumninja.com/profiling-ti-mobile-apps-is-it-possible/).

At the moment, the custom `libTicore.a` library is distributed exclusively in binary form and the contained modifications are not released as open source, but they may well be in the future.

### Server component installation
You need to have [node.js](http://nodejs.org/) installed in your system and once you have cloned this repository you need to update its dependencies:

		npm install -d
	
you can then run the server as any node program with:

		node server.js

or create a global link with:
	
		sudo npm link
	
then you can start the the server from anywhere with:
	
		tiprofiler

The server only depends on [socket.io](http://socket.io/).

## Client app
Once the `tiprofiler` server is running, you can point your browser to:

	http://localhost:9876/app/index.html
	
and a web-based GUI will be presented to you.

The client app is extremely simple at the moment, and when a Ti application built with the above custom SDK is running inside the iOS emulator, it allows to do the following:

* stop the profiler (the profiler is started as soon as the Ti application starts)
* re-start the profiler
* Once the profiler is stopped, show the profiling data in a tree-grid
* Show the source code for the files referenced in the profile tree

### Technologies

The client app is built on top of the following technologies:

* [Ext JS](http://www.sencha.com/products/extjs/): General layout & tree-grid
* [ACE editor](http://ace.ajax.org/): for showing the original source code of the selected application files
* [socket.io](http://socket.io/): for event-based communication with the server

## Limitations
Currently TiProfiler suffers from the following limitations (and surely many others) :

* It doesn't work for Android targets
* It can be used only with apps running inside the iOS Simulator:  apps should be able to execute on device, but at the moment, no profiling data can be exchanged with the node.js server component
* The client app is currently very limited. I'm thinking about replacing it with the client from the [Node Inspector](https://github.com/dannycoates/node-inspector/) project
 

## Disclaimer 
TiProfiler is not meant to be used in a production environment. The custom Ti SDK contains modifications that can affect both the performance and the overall security of your Titanium application, so it is meant to be used in a restricted development environment. 

Do not distribute iOS applications built with such version of the SDK. Sending applications built with such version of the SDK to Apple for revision may cause a rejection of the app for distribution through the AppStore. 

In particular, the following clause is to be retained valid for the use of this distribution of the Titanium SDK, containing closed source modifications to the JavaScriptCore library:

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.   

## License
* Appcelerator Titanium SDK is Copyright (c) 2009-2012 by Appcelerator, Inc.

* The server code is released under the MIT license:

	Copyright (c) 2012 Olivier Morandi
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.   

* The client application code, being based on ExtJS, is released under the terms of the [GPLv3 license](http://www.gnu.org/copyleft/gpl.html)	
	
	

