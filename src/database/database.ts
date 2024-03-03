import mongoose from 'mongoose';
import conf from '../config';

const { dbName, dbUsername, dbPassword } = conf;

export const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@cluster0.aj3onsv.mongodb.net/${dbName}?retryWrites=true&w=majority`);
    console.log('MongoDB connected!');
  } catch (err: any) {
    console.log('Error::connectDatabaseFailure ' + err.message);
    process.exit(1);
  }
};
