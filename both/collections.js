import { Mongo } from 'meteor/mongo';

MoneyAccounts = new Mongo.Collection("moneyAccounts");
Transactions = new Mongo.Collection("transactions");
Tags = new Mongo.Collection("tags");