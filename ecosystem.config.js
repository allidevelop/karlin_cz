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
  }, {
    name: 'automycka-karlin-bot',
    script: 'telegram-bridge/bot.js',
    cwd: '/home/developer/projects/moykacz',
    filter_env: ['CLAUDECODE'],
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    max_memory_restart: '512M',
    restart_delay: 5000,
  }]
}
