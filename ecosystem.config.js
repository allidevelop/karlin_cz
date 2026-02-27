module.exports = {
  apps: [{
    name: 'automycka-karlin',
    script: 'node_modules/.bin/next',
    args: 'start -p 3231',
    cwd: '/home/developer/projects/moykacz',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3231
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
}
