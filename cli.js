#!/usr/bin/env node

// The Static Plus command-line tool
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var fs = require('fs')
var URL = require('url')
var util = require('util')
var optimist = require('optimist')

//var sp = require('./api')
var Deuce = require('./deuce')

var OPTS = optimist.describe('prefix', 'Production hostname prefix')
                   .default('prefix', 'www.')
                   .describe('staging-prefix', 'Staging hostname prefix')
                   .default('staging-prefix', 'staging.')
                   .describe('seed', 'Seed build data from a directory')
                   .describe('publish', 'Push website attachments from a directory')
                   .usage('$0 <couch> <db> <domain | --seed=... | --publish=...>')

function main(argv) {
  var couch = argv._[0]
    , db    = argv._[1]
    , host  = argv._[2]

  var site = new Deuce
  site.db  = db
  site.hostname = host

  if(argv.help || (!host && !argv.seed && !argv.publish))
    return OPTS.showHelp()

  if('prefix' in argv)
    site.production_prefix = argv.prefix
  if('staging-prefix' in argv)
    site.staging_prefix = argv['staging-prefix']

  //if(argv.log)
  //  site.log.transports.console.level = argv.log

  couch = URL.parse(couch)
  if(argv.creds)
    couch.auth = argv.creds

  site.couch = URL.format(couch)
  site.run()
}

if(require.main === module)
  main(OPTS.argv)
//  , lib = require('./lib').defaults({ 'args': ['couch', 'db', 'hostname']
//                                    , 'describe': { 'prefix': 'Production hostname prefix (default "www.")'
//                                                  }
//                                    })
