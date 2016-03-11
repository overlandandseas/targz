// targz - Simple tar.gz compression and decompression for NodeJS.
// Based on https://github.com/lafin/node-targz
// Copyright (c) 2016 Miska Kaipiainen
// MIT license
'use strict'

const fs = require('fs')
const tar = require('tar-fs')
const zlib = require('zlib')

module.exports = {

    compress: (opts, callback) => {

        // ensure callback and provide utility
        var error = callback = callback || _emptyFunction

        // ensure opts
        opts = opts || {}
        opts.tar = opts.tar || {}
        opts.gz = opts.gz || {}

        // default gzip config
        opts.gz.level = opts.gz.level || 6
        opts.gz.memLevel = opts.gz.memLevel || 6

        // ensure src and dest
        if(!opts.src)
            return error({message: "No source for compress!"}) //put these on new lines for testing purposes
        if(!opts.dest)
            return error({message: "No destination for compress!"})

        // go
        process.nextTick(() => {
            tar.pack(opts.src, opts.tar)
                .on('error', error)
                .pipe(zlib.createGzip(opts.gz)
                .on('error', error))
                .pipe(fs.createWriteStream(opts.dest)
                .on('error', error)
                .on('finish', callback))
        })
    },

    decompress: (opts, callback) => {

        // ensure callback and provide utility
         var error = callback = callback || _emptyFunction

        // ensure opts
        opts = opts || {}
        opts.tar = opts.tar || {}
        opts.gz = opts.gz || {}

        // ensure src and dest
        if(!opts.src)
            return error({message: "No source for decompress!"})
        if(!opts.dest)
            return error({message: "No destination for decompress!"})

        // go
        process.nextTick(function () {
            fs.createReadStream(opts.src)
                .on('error', error)
                .pipe(zlib.createGunzip(opts.gz)
                    .on('error', error))
                .pipe(tar.extract(opts.dest, opts.tar)
                    .on('error', error)
                    .on('finish', callback))
        });
    }

};

//helpers
function _emptyFunction(){}
