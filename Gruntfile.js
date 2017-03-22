module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-sync");
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks("grunt-rsync-2");
  grunt.loadNpmTasks("grunt-contrib-clean");

  //var api_location;
  var api_location;
  var deploy_target;
  var target = grunt.option("target") || "dev";
  if (target == "stage") {
    api_location="http://nodetest0:3000";
  } else if (target == "live") {
    api_location="http://docker-dev:3080"; 
  } else { 
    api_location="http://127.0.0.1:3001"; 
  }

  var config = { "serverfiles": [
            "*js",
            "Dockerfile",
            "package.json",
            "!**/config/**",
            "!**/*.txt",
            "!**/.*",
        ],
        "serverconf": [
            "**/config/default.json",
            "**/config/" + target + ".json",
        ],
          "clientfiles": [
            "**",
            "!**/targets.json",
            "!**/views/*.html",
            "!**/*.txt",
            "!**/*.ejs",
            "!**/.*",
        ]
      };

  grunt.initConfig({
    
    jshint: {
        options: {
          globals: {
            jQuery: true
           }
          },
        //client: {files: { src: ["client/**/*.js"]}},
        server: {files: { src: ["server/**/*.js"]}},
        gruntfile: {files: { src: ["Gruntfile.js"]}}
    },

    sync: {
      client: {
        files: [{
          cwd: "client",
          src: config.clientfiles,
          dest: "build/" + target + "/client",
        }]
      },
     server: 
        {files: [{
          cwd: "server",
          src: config.serverfiles,
          dest: "build/" + target + "/server",
        }]
      },
      serverconf: 
        {files: [{
          cwd: "server",
          src: config.serverconf,
          dest: "build/" + target + "/server",
        }]
      },
    },

    replace: {
          client: {
            options: {
              patterns: [
                {
                  match: "title",
                  replacement: "Hello - " + target
                },
                {
                  match: "api_location",
                  replacement: api_location
                }
              ]
            },
            files: [
              {expand: true, flatten: true, src: ["client/views/*.html"], dest: "build/" + target + "/client/views/"}
            ]
          }
        },
      //http://127.0.0.1:3000

    rsync: {
        deployclient: {
          files: "build/" + target + "/client/",
          options: {
            host      : "nodetest0.l6",
            port      : "22",
            user      : "root",
            remoteBase: "/var/www/html/" + target
          }
        },
         deployserver: {
          files: "build/" + target + "/server/",
          options: {
            host      : "nodetest0.l6",
            port      : "22",
            user      : "root",
            remoteBase: "~/" + target
          }
        },
        transferdocker: {
          files: "build/" + target,
          options: {
            host      : "docker-registry.l6",
            port      : "22",
            user      : "root",
            remoteBase: "/opt/docker-data/rest-crud/"
          }
        }
      },

    clean: {
      build: ["build/"],
      target: ["build/" + target]
    },

    watch: {
      gruntfile: {
        files: "Gruntfile.js",
        tasks: ["jshint:gruntfile"],
      },
//      clientjshint: {
//        files: "<%= jshint.client.files %>",
//        tasks: ["jshint:client"],
//      },

      clientsync: {
        files: config.clientfiles,
        tasks: ["sync:client", "replace:client"],
                options: {cwd: {
              files: "client",
            }}
      },
      serversync: {
        files: config.serverfiles,
        tasks: ["sync:server"],
        options: {cwd: {
              files: "server",
            }}
      },
      serverconfsync: {
        files: config.serverconf,
        tasks: ["sync:serverconf"],
        options: {cwd: {
              files: "server",
            }}
      },
      serverjshint: {
        files: "<%= jshint.server.files %>",
        tasks: ["jshint:server"],
      }
    }
});


//  grunt.registerTask("deploy", ["jshint", "sync:clientB:" + target]);
  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("build", ["jshint", "sync:client", "sync:server", "sync:serverconf", "replace:client"]);

  grunt.registerTask("deploy-remote", ["jshint", "sync:client", "sync:server", "sync:serverconf", "rsync:deployclient", "rsync:deployserver"]);

  grunt.registerTask("transfer-docker", ["rsync:transferdocker"]);
  //grunt.registerTask("deploy-server", ["jshint", "sync:client", "sync:server", "sync:serverconf", "replace:client"]);
  //grunt.registerTask("deploy", ["jshint", "sync:client", "sync:server", "sync:serverconf", "replace:client"]);
  //grunt.registerTask( "default", [ "jshint","sync", "watch" ] );

};
