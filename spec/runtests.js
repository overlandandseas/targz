'use strict'

const Jasmine = require('jasmine')

let jasmine = new Jasmine()

jasmine.loadConfigFile('spec/support/jasmine.json')

jasmine.onComplete(passed => {
    if (passed) console.log('All specs have passed')
    else console.log('Not all specs have passed')
})

jasmine.execute()
