import mongoose from 'mongoose';
import config from '../config/DB&ServerConfig';
// import server from './server';

mongoose
  .connect(config.DB.URL.toString(), {
    useNewUrlParser: true,
    writeConcern: {
      retryWrites: true
    }
  } as mongoose.MongooseOptions)
  .then(() => console.log('Connected successfully to mongoDB server\n', mongoose.connections))
  .catch((err) => console.log(err.message));

//   .then(() => server.listen(config.server.PORT, () => console.log(`Server started on port ${config.server.PORT}`)))
