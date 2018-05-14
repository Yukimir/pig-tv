import * as mongoose from 'mongoose';
import { Constants } from '../constants';

export const databaseProviders = [
    {
        provide: Constants.DbConnectionToken,
        useFactory: async (): Promise<typeof mongoose> =>
            await mongoose.connect('mongodb://localhost/pig-tv'),
    },
];