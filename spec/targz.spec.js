'use strict'

const targz = require('../lib/targz')
const rimraf = require('rimraf')
const fs = require('fs')

describe('The targz module', () => {
    describe('the "compress" function', () => {
        const srcPath = `${__dirname}/compressiontest/uncompressedbmth.txt`
        const destPath = `${__dirname}/compressiontest/compressedbmth.tar.gz`
        let originalFileStats = false
        let targzFileStats = false
        beforeEach(done => {
            fs.stat(srcPath, (err, data) => {
                originalFileStats = data
                targz.compress({src: srcPath, dest: destPath}, err => {
                    fs.stat(destPath, (err, data) => {
                        targzFileStats = data
                        rimraf(destPath, done)
                    })
                })
            })
        })
        it('should compress the test data file into something', () => {
            expect(targzFileStats.isFile()).toBe(true)
        })
        it('should compress the data to a smaller file size', () => {
            expect(originalFileStats.size > targzFileStats.size).toBe(true)
        })

        it('should throw error is no source is defined', () => {
            targz.compress({dest: destPath}, err => {
                expect(err.message).toBe("No source for compress!")
            })
        })
        it('should throw error is no destination is defined', () => {
            targz.compress({src: srcPath}, err => {
                expect(err.message).toBe("No destination for compress!")
            })
        })
    })

    describe('the "decompress" function', () => {
        const srcPath = `${__dirname}/decompressiontest/compressedinformation.tar.gz`
        const destPath = `${__dirname}/decompressiontest`
        let information = false


        beforeEach(done => {
            targz.decompress({src: srcPath, dest: destPath}, err => {
                fs.readFile(`${destPath}/information.txt`, 'utf8', (err, data) => {
                    information = data
                    rimraf(`${destPath}/information.txt`, done)
                })
            })
        })
        it('should decompress the data int eh specified folder', () => {
            expect(information).toBeDefined()
        })
        it('should not lose information when uncompressing data', () => {
            expect(information).toBe("I touched the butt.\n")
        })
        it('should throw error is no source is defined', () => {
            targz.decompress({dest: destPath}, err => {
                expect(err.message).toBe("No source for decompress!")
            })
        })
        it('should throw error is no destination is defined', () => {
            targz.decompress({src: srcPath}, err => {
                expect(err.message).toBe("No destination for decompress!")
            })
        })
    })
})
