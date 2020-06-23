  if (process.env.NODE_ENV !== 'production') {
      require('dotenv').config()
  }

  const express = require('express');
  const expressLayouts = require('express-ejs-layouts');
  const mongoose = require('mongoose');
  const flash = require('connect-flash');
  const session = require('express-session');
  const passport = require('passport');
  const methodOverride = require('method-override');
  const app = express();

  //Passport config
  require('./config/passport')(passport);

  //Connect to Mongo
  mongoose.connect(process.env.MongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      }).then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err));

  //EJS
  app.use(expressLayouts);
  app.set('view engine', 'ejs');
  app.use(methodOverride('_method'));

  // BodyParser
  app.use(express.urlencoded({
      extended: false
  }));

  // Express Session
  app.use(session({
      secret: 'dog',
      resave: true,
      saveUninitialized: true,
  }));

  // Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Connect Flash
  app.use(flash());

  //Global Vars
  app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  })

  //Routes
  app.use('/', require('./routes/index'));
  app.use('/users', require('./routes/users'));


  const PORT = process.env.PORT || 3000;

  app.listen(PORT, console.log(`Server started on port ${PORT}`));