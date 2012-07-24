var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    Logger = require("socket.io/lib/logger");

var log_levels = [
    'error'
  , 'warn'
  , 'info'
  , 'debug'
];

var argv = require("optimist").argv;

var server_dir = __dirname;
var client_dir = server_dir;

var logLevel = 2;

var dl = argv["log-level"] || argv["l"];
if (dl) {
    var index = log_levels.indexOf(dl);
    if (index > 0) {
        logLevel = index;
    }
    console.log(dl);
    console.log(index);
}


var fancyLog = new Logger();
fancyLog.level = logLevel;


//server port at the moment is locked to 9876
//var port = argv.port || argv.p || 9876;
var port = 9876;

var profilerRunning = false;

var lastProfileInfo = null;




var clientAppFile = function(uri) {
    fancyLog.log('debug', 'requested file: ' + path.join(client_dir, uri));
    return path.join(client_dir, uri);
};


var notFound404 = function(response, res) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found\n");
    response.end();
    fancyLog.log('error', res + " not found!");
};


var error500 = function(response, err) {
    response.writeHead(500, {"Content-Type": "text/plain"});
    response.write(err + "\n");
    response.end();
    fancyLog.log('error', err);
};


var ok200 = function(response, data) {
    response.writeHead(200);
    response.write(data, 'binary');
    response.end();
    fancyLog.log('debug', "OK!");
};

var redir302 = function(response, location) {
    response.writeHead(302, {
       'Location': location
    });
    response.end();
    fancyLog.log("debug", "redirect to location: " + location);
};


var getFile = function(response, filename) {
    fancyLog.log('debug', 'getting file: ' + filename);
    path.exists(filename, function(exists) {
        if(!exists) {
            notFound404(response, filename);
            return;
        }

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                error500(response, err);
                return;
            }

            ok200(response, file);
        });
    });
};


var process_node = function(node, f) {
    if (!f || typeof(f) !== 'function') { return; }
    var process = function(node) {
        process_node(node, f);
    };
    if (node.children) {
        node.children.forEach(process);
    }

    if (f) {
        f(node);
    }
};

var process_profile = function(profile, f) {
    process_node(profile, f);
};


var preprocess_profile = function(profile) {
    var min_url_len = Number.MAX_VALUE;
    var min_url = null;

    var check_url_prefix = function(node){
        if (node.url && node.url !== '') {
            var url_comp = node.url.split('/');
            if (url_comp.length < min_url_len) {
                min_url_len = url_comp.length;
                min_url = node.url;
            }
        }
    };

    process_profile(profile, check_url_prefix);
    var last_slash_pos = min_url.lastIndexOf('/');
    var url_prefix = min_url.substr(0, last_slash_pos);

    var sanitize_node = function(node) {
        if (node.url && node.url !== '') {
            node.file = node.url.substr(last_slash_pos);
            node.url = node.url.replace(/^file:\/\/localhost/gi, 'http://localhost:' + port);
        }
        if (!node.children) {
            node.children = [];
        }
    };

    process_profile(profile, sanitize_node);

    return profile;
};



var server = http.createServer(function(request, response) {
    var uri = decodeURI(url.parse(request.url).pathname);

    fancyLog.log('debug', "processing request for " + uri + "...");

    if (uri === '/' || uri == '/app') {
        redir302(response, '/app/index.html');
    }

    if (uri.match(/^\/app/i)) {
        getFile(response, clientAppFile(uri));
        return;
    }
    
    getFile(response, path.join(uri, ''));

});

var io = require('socket.io').listen(server);
io.set('log level', logLevel);

io.sockets.on('connection', function (socket) {
    fancyLog.log('debug', 'new socket.IO connection');

    socket.on('TiProfiler:running', function(data) {
        fancyLog.log('warn', 'Profiler connected');
        fancyLog.log('debug', 'received: TiProfiler:running');
        //fancyLog.log('TiProfiler: ' + JSON.stringify(data));
        if (data.running) {
            profilerRunning = true;
            fancyLog.log('debug', 'sending profiler:didStart');
            socket.broadcast.emit('profiler:didStart', data);
        }
        else {
            profilerRunning = false;
            if (data.profileInfo) {
                try {
                    var profile = preprocess_profile(JSON.parse(data.profileInfo));
                    lastProfileInfo = JSON.stringify(profile);
                }
                catch(e) {
                    fancyLog.log('error', 'Can\'t parse profile: ' + e.message);
                }
            }
            data.profileInfo = lastProfileInfo;
            fancyLog.log('debug', 'sending profiler:didStop: ' + data.profileInfo);
            socket.broadcast.emit('profiler:didStop', data);
        }
    });

    //these are commands coming from the client and passed to the profiling server running in the iOS app
    socket.on('TiProfiler:stop', function(data) {
        fancyLog.log('debug', 'received: TiProfiler:stop --> re-broadcasting it');
        socket.broadcast.emit('TiProfiler:stop', data);
    });

    socket.on('TiProfiler:start', function(data) {
        fancyLog.log('debug', 'received: TiProfiler:start --> re-broadcasting it');
        socket.broadcast.emit('TiProfiler:start', data);
    });

    socket.on('TiProfiler:isRunning', function(data) {
        fancyLog.log('warn', 'Client application connected');
        fancyLog.log('debug', 'received: TiProfiler:isRunning --> re-broadcasting it');
        socket.broadcast.emit('TiProfiler:isRunning', data);
    });
});

server.listen(port);

fancyLog.log("info", "server running at http://localhost:" + port + '/');
fancyLog.log("debug", "serving files from " + server_dir);
