/*
  Riot.js 0.9.2 | moot.it/riotjs | @license MIT
  (c) 2013 Tero Piirainen, Moot Inc and other contributors.
 */
"use strict";
(function($, win) {

  // Precompiled templates (JavaScript functions)
  var FN = {}, slice = [].slice;

  // Render a template with data
  $.render = function(template, data) {
    return !template ? '' : (FN[template] = FN[template] || new Function("_",
      "return '" + template
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/'/g, "\\'")
        .replace(/\{\s*(\w+)\s*\}/g, "' + (_.$1 === undefined || _.$1 === null ? '' : _.$1) + '") +
      "'"
    ))(data);
  }

  // A classic pattern for separating concerns
  $.observable = function(obj) {
    var jq = $({});

    $.each(['on', 'one', 'trigger', 'off'], function(i, name) {
      obj[name] = function(names, fn) {

        // on, one
        if (i < 2) {
          jq[name](names, function(e) {
            var args = slice.call(arguments, 1);
            if (names.split(" ")[1]) args.unshift(e.type);
            fn.apply(obj, args);
          });

        // trigger
        } else if (i === 2) {
          jq.trigger(names, slice.call(arguments, 1));

        // off
        } else {
          jq.off(names);
        }

        return obj;
      };

    });

    return obj;
  };

  // jQueried window object
  win = $(win);

  // emit window.popstate event consistently on page load, on every browser
  var page_popped;

  win.on("load", function(e) {
    setTimeout(function() {
      if (!page_popped) win.trigger("popstate");
    }, 1);

  }).on("popstate", function(e) {
    if (!page_popped) page_popped = true;
  });

  // Change the browser URL or listen to changes on the URL
  $.route = function(to) {

    // listen
    if ($.isFunction(to)) {
      win.on("popstate", function(e, hash) {
        to(hash || location.hash);
      });

    // fire
    } else if (to != location.hash) {
      if (history.pushState) history.pushState("", "", to);
      win.trigger("popstate", [to]);
    }
  };

})(jQuery, window);
