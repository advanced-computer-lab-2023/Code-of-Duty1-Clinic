import mongoose from 'mongoose';
import config from '../config/DB&ServerConfig';
import app from './server';
import AppointmentModel from './models/appointment.model';
import ContractModel from './models/contract.model';
console.log(config.DB.URL.toString());
mongoose
  .connect(config.DB.URL.toString(), {
    useNewUrlParser: true,
    writeConcern: {
      retryWrites: true
    }
  } as mongoose.MongooseOptions)
  .then(() => console.log('Connected successfully to mongoDB server\n'))

  .then(() =>
    app.listen(config.server.PORT, () => console.log(`Server started on http://localhost:${config.server.PORT}`))
  )

  .catch((err) => console.log(err.message));
