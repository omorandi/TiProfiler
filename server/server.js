var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var server_dir = process.cwd();
var client_dir = server_dir + '/..';

var port = 9876;
var profiler_port = 8080;


//var json_data = '{"url":"","line":0,"function":"Thread_1","selfMs":0.000000,"selfP":0.000000,"totalMs":5474.821777,"totalP":100.000000,"count":1,"children":[{"url":"","line":4294967295,"function":"(program)","selfMs":5407.036621,"selfP":98.761875,"totalMs":5474.804932,"totalP":99.999692,"count":1,"children":[{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/app.js","line":1,"function":"(program)","selfMs":0.257324,"selfP":0.004700,"totalMs":64.170166,"totalP":1.172096,"count":1,"children":[{"url":"","line":0,"function":"(Function object)","selfMs":43.804932,"selfP":0.800116,"totalMs":43.864990,"totalP":0.801213,"count":1,"children":[{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/included.js","line":1,"function":"(program)","selfMs":0.060059,"selfP":0.001097,"totalMs":0.060059,"totalP":0.001097,"count":1}]},{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/app.js","line":6,"function":"launch_test1","selfMs":0.116943,"selfP":0.002136,"totalMs":9.656006,"totalP":0.176371,"count":1,"children":[{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/included.js","line":4,"function":"test1","selfMs":5.473145,"selfP":0.099969,"totalMs":9.539062,"totalP":0.174235,"count":1,"children":[{"url":"","line":0,"function":"cos","selfMs":3.965820,"selfP":0.072437,"totalMs":3.965820,"totalP":0.072437,"count":1000},{"url":"","line":0,"function":"(Function object)","selfMs":0.100098,"selfP":0.001828,"totalMs":0.100098,"totalP":0.001828,"count":1}]}]},{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/app.js","line":13,"function":"launch_test2","selfMs":0.156494,"selfP":0.002858,"totalMs":9.849854,"totalP":0.179912,"count":1,"children":[{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/included.js","line":16,"function":"(anonymous function)","selfMs":5.383545,"selfP":0.098333,"totalMs":9.693359,"totalP":0.177053,"count":1,"children":[{"url":"","line":0,"function":"sin","selfMs":4.229736,"selfP":0.077258,"totalMs":4.229736,"totalP":0.077258,"count":1000},{"url":"","line":0,"function":"(Function object)","selfMs":0.080078,"selfP":0.001463,"totalMs":0.080078,"totalP":0.001463,"count":1}]}]},{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/included.js","line":27,"function":"(anonymous function)","selfMs":0.367920,"selfP":0.006720,"totalMs":0.541992,"totalP":0.009900,"count":1,"children":[{"url":"","line":0,"function":"setTimeout","selfMs":0.174072,"selfP":0.003180,"totalMs":0.174072,"totalP":0.003180,"count":1}]}]},{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/included.js","line":29,"function":"1 second timeout","selfMs":0.108887,"selfP":0.001989,"totalMs":3.315918,"totalP":0.060567,"count":1,"children":[{"url":"","line":0,"function":"(Function object)","selfMs":0.080078,"selfP":0.001463,"totalMs":0.080078,"totalP":0.001463,"count":1},{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/app.js","line":18,"function":"(anonymous function)","selfMs":0.922852,"selfP":0.016856,"totalMs":3.126953,"totalP":0.057115,"count":1,"children":[{"url":"","line":0,"function":"(Function object)","selfMs":2.204102,"selfP":0.040259,"totalMs":2.204102,"totalP":0.040259,"count":3}]}]},{"url":"","line":1,"function":"(program)","selfMs":0.021973,"selfP":0.000401,"totalMs":0.038818,"totalP":0.000709,"count":1,"children":[{"url":"","line":0,"function":"Object","selfMs":0.016846,"selfP":0.000308,"totalMs":0.016846,"totalP":0.000308,"count":1}]},{"url":"file://localhost/Users/olivier/Library/Application%20Support/iPhone%20Simulator/5.0/Applications/6E487946-FE8F-448E-981E-2BB4840F2F75/profiling.app/app.js","line":21,"function":"(anonymous function)","selfMs":0.140625,"selfP":0.002569,"totalMs":0.243408,"totalP":0.004446,"count":1,"children":[{"url":"","line":0,"function":"(Function object)","selfMs":0.102783,"selfP":0.001877,"totalMs":0.102783,"totalP":0.001877,"count":1}]}]},{"url":"","line":0,"function":"(idle)","selfMs":0.016846,"selfP":0.000308,"totalMs":0.016846,"totalP":0.000308,"count":0}]}';


var profiler_request = function(upstream_response, req_path, transform) {
    var profiler_host = "localhost";
    var client = http.createClient(profiler_port, profiler_host);
    var read_data = "";
    var request = client.request("GET", req_path, {'host' : profiler_host});

    request.on('response', function(response) {
            response.setEncoding('utf8');
            upstream_response.writeHead(response.statusCode);
            response.on('data', function(chunk) {
                read_data += chunk;
            });
            response.on('end', function() {
                if (transform) {
                    read_data = transform(read_data);
                }
                upstream_response.write(read_data, 'binary');
                upstream_response.end();
            });
    });

    client.on('error', function(err) {
        error500(upstream_response, err);
    });
    request.end();
};

var clientAppFile = function(uri) {
    console.log('requested file: ' + path.join(client_dir, uri));
    return path.join(client_dir, uri);
};


var notFound404 = function(response, res) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found\n");
    response.end();
    console.log("[error] " + res + " not found!");
};


var error500 = function(response, err) {
    response.writeHead(500, {"Content-Type": "text/plain"});
    response.write(err + "\n");
    response.end();
    console.log("[error] " + err);
};


var ok200 = function(response, data) {
    response.writeHead(200);
    response.write(data, "binary");
    response.end();
    console.log("[info] >>> OK!");
};


var profilerOp = function(response, uri) {
    if (uri === '/profiler/running') {
        profiler_request(response, uri);
        //ok200(response, '{"running": true}');
    }
    else if (uri === '/profiler/start') {

    }
    else if (uri === '/profiler/stop') {
        profiler_request(response, uri, function(data) {
            if (data && data !== "") {
                console.log(data);
                var profile = preprocess_profile(JSON.parse(data));
                return JSON.stringify(profile);
            }
            return "";
        });
    }
};



var getFile = function(response, filename) {
    console.log('getting file: ' + filename);
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
    console.log('min_url: ' + min_url);
    var last_slash_pos = min_url.lastIndexOf('/');
    var url_prefix = min_url.substr(0, last_slash_pos);
    console.log('url_prefix: ' + url_prefix);

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

    console.log("[info] processing request for " + uri + "...");

    if (uri.match(/^\/client/gi)) {
        getFile(response, clientAppFile(uri));
        return;
    }
    else if (uri.match(/^\/profiler/gi)) {
        profilerOp(response, uri);
        return;
    }
    
    getFile(response, path.join(uri, ''));

});

var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
    console.log('new socket connection');
    
    socket.on('profiler:didStart', function(data) {
        console.log('received profiler:didStart');
        socket.broadcast.emit('profiler:didStart', data);
    });

    socket.on('profiler:didStop', function(data) {
        socket.broadcast.emit('profiler:didStop', data);
    });
});

server.listen(port);

console.log("[info] server running at http://localhost:" + port + '/');
console.log("[info] serving files from " + server_dir);
