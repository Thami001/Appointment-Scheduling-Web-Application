import * as sdk from 'node-appwrite'

export const {DATABASE_ID ,PROJECT_ID, API_KEY, TECHNICIAN_COLLECTION_ID, APPOINTMENT_COLLECTION_ID, CLIENT_COLLECTION_ID, OPENAI_API_KEY, NEXT_PUBLIC_BUCKET_ID: BUCKET_ID, NEXT_PUBLIC_ENDPOINT: ENDPOINT } = process.env;

const client = new sdk.Client()

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!)

export const databases = new sdk.Databases(client)
export const storage = new sdk.Storage(client)
export const messaging = new sdk.Messaging(client)
export const users = new sdk.Users(client)