export const corsOptions = {
  origin: '*', //http://localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, //true
  maxAge: 86400,
  optionsSuccessStatus: 200,
};
