const fs = require('fs');
const { config } = require('process');
const dirs = ['controllers', 'middlewares', 'models', 'routes', 'utils'];
const files = {
  config: ['db.js'],
  controllers: ['authController.js'],
  middlewares: ['authMiddleware.js', 'adminMiddleware.js'],
  models: ['User.js'],
  routes: ['authRoutes.js'],
  services: ['cloudinary.js'],
  utils: ['logger.js'],
  root: ['.env', '.gitignore', 'server.js', 'index.js', 'package.json']
};

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  files[dir].forEach(file => fs.writeFileSync(`${dir}/${file}`, ''));
});

files.root.forEach(file => fs.writeFileSync(file, ''));
console.log('✅ Project structure created successfully!');