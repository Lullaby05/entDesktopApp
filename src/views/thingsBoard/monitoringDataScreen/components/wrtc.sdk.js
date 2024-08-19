function WRtcError(name, message) {
  this.name = name;
  this.message = message;
  this.stack = new Error().stack;
}
WRtcError.prototype = Object.create(Error.prototype);
WRtcError.prototype.constructor = WRtcError;

// Depends on adapter-7.4.0.min.js from https://github.com/webrtc/adapter
// Async-await-promise based WRTC Player.
export function WRtcPlayerAsync() {
  var self = {};

  self.play = async function (dev_data) {
    console.log('async url: ' + dev_data.url);
    var conf = self.__internal.prepareUrl(dev_data.url);
    console.log('conf.apiUrl: ' + conf.apiUrl);
    console.log('conf.port: ' + conf.port);
    console.log('conf.schema: ' + conf.schema);
    console.log('conf.streamUrl: ' + conf.streamUrl);
    console.log('conf.tid: ' + conf.tid);
    console.log('conf.urlObject.app: ' + conf.urlObject.app);
    console.log('conf.urlObject.port: ' + conf.urlObject.port);
    console.log('conf.urlObject.schema: ' + conf.urlObject.schema);
    console.log('conf.urlObject.server: ' + conf.urlObject.server);
    console.log('conf.urlObject.stream: ' + conf.urlObject.stream);
    console.log('conf.urlObject.url: ' + conf.urlObject.url);
    console.log('conf.urlObject.user_query: ' + conf.urlObject.user_query);
    self.pc.addTransceiver('audio', { direction: 'recvonly' });
    self.pc.addTransceiver('video', { direction: 'recvonly' });

    var offer = await self.pc.createOffer();
    await self.pc.setLocalDescription(offer);
    var session = await new Promise(function (resolve, reject) {
      var data = {
        api: conf.apiUrl,
        tid: conf.tid,
        streamurl: conf.streamUrl,
        stream: conf.urlObject.stream,
        clientip: null,
        sdp: offer.sdp,
        nettype: dev_data.nettype,
        username: dev_data.username,
        password: dev_data.passwd,
        channelid: dev_data.channelid,
      };
      if (3 == dev_data.channelid) {
        data.starttime = dev_data.starttime;
      }
      console.log('Generated offer: ', data);

      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        if (xhr.readyState !== xhr.DONE) return;
        if (xhr.status !== 200) return reject(xhr);
        const data = JSON.parse(xhr.responseText);
        console.log('Got answer: ', data);
        if (data.hasOwnProperty('ipv6')) {
          console.log('ipv6键值存在');
          console.log('session :');
          //session.apiurl = data.ipv6;
          return reject(data);
        }
        return data.code ? reject(xhr) : resolve(data);
      };
      xhr.open('POST', conf.apiUrl, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
    });
    await self.pc.setRemoteDescription(
      new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
    );
    session.simulator =
      conf.schema +
      '//' +
      conf.urlObject.server +
      ':' +
      conf.port +
      '/rtc/v1/nack/';
    session.apiurl = conf.apiUrl;
    return session;
  };

  // Close the player.
  self.close = function () {
    self.pc && self.pc.close();
    self.pc = null;
  };

  // The callback when got remote track.
  // Note that the onaddstream is deprecated, @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onaddstream
  self.ontrack = function (event) {
    // https://webrtc.org/getting-started/remote-streams
    self.stream.addTrack(event.track);
  };

  // Internal APIs.
  self.__internal = {
    defaultPath: '/rtc/v1/play',
    prepareUrl: function (webrtcUrl) {
      var urlObject = self.__internal.parse(webrtcUrl);

      // If user specifies the schema, use it as API schema.
      var schema = urlObject.user_query.schema;
      schema = schema ? schema + ':' : window.location.protocol;
      console.log('schema: ' + schema);

      if (schema === 'file:') {
        schema = 'https:';
      }
      console.log('schema: ' + schema);
      console.log('urlObject.server: ' + urlObject.server);

      var port = urlObject.port || 1985;
      if (schema === 'https:') {
        port = 1990;
      }

      // @see https://github.com/rtcdn/rtcdn-draft
      var api = urlObject.user_query.play || self.__internal.defaultPath;
      if (api.lastIndexOf('/') !== api.length - 1) {
        api += '/';
      }

      apiUrl = schema + '//' + urlObject.server + ':' + port + api;
      for (var key in urlObject.user_query) {
        if (key !== 'api' && key !== 'play') {
          apiUrl += '&' + key + '=' + urlObject.user_query[key];
        }
      }
      // Replace /rtc/v1/play/&k=v to /rtc/v1/play/?k=v
      var apiUrl = apiUrl.replace(api + '&', api + '?');

      var streamUrl = urlObject.url;

      return {
        apiUrl: apiUrl,
        streamUrl: streamUrl,
        schema: schema,
        urlObject: urlObject,
        port: port,
        tid: Number(parseInt(new Date().getTime() * Math.random() * 100))
          .toString(16)
          .slice(0, 7),
      };
    },
    parse: function (url) {
      // @see: http://stackoverflow.com/questions/10469575/how-to-use-location-object-to-parse-url-without-redirecting-the-page-in-javascri
      var a = document.createElement('a');
      a.href = url.replace('webrtc://', 'http://').replace('rtc://', 'http://');

      var vhost = a.hostname;
      var app = a.pathname.substring(1, a.pathname.lastIndexOf('/'));
      var stream = a.pathname.slice(a.pathname.lastIndexOf('/') + 1);

      app = app.replace('...vhost...', '?vhost=');
      if (app.indexOf('?') >= 0) {
        var params = app.slice(app.indexOf('?'));
        app = app.slice(0, app.indexOf('?'));

        if (params.indexOf('vhost=') > 0) {
          vhost = params.slice(params.indexOf('vhost=') + 'vhost='.length);
          if (vhost.indexOf('&') > 0) {
            vhost = vhost.slice(0, vhost.indexOf('&'));
          }
        }
      }

      // when vhost equals to server, and server is ip,
      // the vhost is __defaultVhost__
      if (a.hostname === vhost) {
        var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if (re.test(a.hostname)) {
          vhost = '__defaultVhost__';
        }
      }

      // parse the schema
      var schema = 'webrtc';
      if (url.indexOf('://') > 0) {
        schema = url.slice(0, url.indexOf('://'));
      }

      var port = a.port;
      if (!port) {
        // Finger out by webrtc url, if contains http or https port, to overwrite default 1985.
        if (schema === 'webrtc' && url.indexOf(`webrtc://${a.host}:`) === 0) {
          port = url.indexOf(`webrtc://${a.host}:80`) === 0 ? 80 : 443;
        }

        // Guess by schema.
        if (schema === 'http') {
          port = 80;
        } else if (schema === 'https') {
          port = 443;
        }
      }

      var ret = {
        url: url,
        schema: schema,
        server: a.hostname,
        port: port,
        vhost: vhost,
        app: app,
        stream: stream,
      };
      self.__internal.fill_query(a.search, ret);

      // For webrtc API, we use 443 if page is https, or schema specified it.
      if (!ret.port) {
        if (schema === 'webrtc' || schema === 'rtc') {
          if (ret.user_query.schema === 'https') {
            ret.port = 443;
          } else if (window.location.href.indexOf('https://') === 0) {
            ret.port = 443;
          } else {
            ret.port = 1985;
          }
        }
      }

      return ret;
    },
    fill_query: function (query_string, obj) {
      // pure user query object.
      obj.user_query = {};

      if (query_string.length === 0) {
        return;
      }

      // split again for angularjs.
      if (query_string.indexOf('?') >= 0) {
        query_string = query_string.split('?')[1];
      }

      var queries = query_string.split('&');
      for (var i = 0; i < queries.length; i++) {
        var elem = queries[i];

        var query = elem.split('=');
        obj[query[0]] = query[1];
        obj.user_query[query[0]] = query[1];
      }

      // alias domain for vhost.
      if (obj.domain) {
        obj.vhost = obj.domain;
      }
    },
  };

  self.pc = new RTCPeerConnection(null);

  // Create a stream to add track to the stream, @see https://webrtc.org/getting-started/remote-streams
  self.stream = new MediaStream();

  // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
  self.pc.ontrack = function (event) {
    if (self.ontrack) {
      self.ontrack(event);
    }
  };

  return self;
}
