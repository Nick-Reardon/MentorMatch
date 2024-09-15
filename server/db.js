import mongoose from 'mongoose';

const { connect } = mongoose;

 /** Options to pass to the mongoose connect method for parsing the URI */
const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'pfa'
}

const dbConnect = (uri = process.env.DB_URI) => {
  connect(uri, dbConfig)
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.log(err));
};

export default dbConnect;