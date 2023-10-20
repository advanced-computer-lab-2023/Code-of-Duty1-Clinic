import mongoose, { Schema, trusted } from 'mongoose';
const options = { discriminatorKey: 'role' };
const ASchema = new Schema({ name: String }, options);

const BSchema = new Schema({ email: String }, options);

// const CSchema = new Schema({ f1: { type: String, required: () => role === 'C' } }, options);

const DSchema = new Schema({ f2: String }, options);

const A = mongoose.model('A', ASchema);
const B = A.discriminator('B', BSchema);

// const c = A.discriminator('C', CSchema);
const d = A.discriminator('D', DSchema);

mongoose.connect('mongodb://127.0.0.1:27017/test1', {
  useNewUrlParser: true,
  writeConcern: {
    retryWrites: true
  }
} as mongoose.MongooseOptions);
const a = new A({ name: 'AAAA', role: 'C' });
// const b = new B({ name: 'BBBB', email: 'BBBB' });
// const c1 = new c({ name: 'CS2CCC', email: 'CCC888C', f1: 'CCC33C', f2: '33333333333333333' });
// const d1 = new d({ name: 'DDDDDDDDD', email: '2222222', f2: '22222222222222' });
// A.deleteMany().then(() => console.log('A'));
a.save().then(() => console.log('A'));
// b.save().then(() => console.log('B'));
// c1.save()
//   .then(() => console.log('C'))
//   .catch((e) => console.log(e));
// d1.save().then(() => console.log('D'));
// A.updateOne({ _id: '6532770e6adb4d70c53b8c64' }, { role: 'Doctor' }).then(() => console.log('D'));
