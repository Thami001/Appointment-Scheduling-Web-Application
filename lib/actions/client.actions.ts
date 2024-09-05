"use server"

import {
    BUCKET_ID,
    CLIENT_COLLECTION_ID,
    DATABASE_ID,
    databases,
    ENDPOINT,
    PROJECT_ID,
    storage,
    users
} from "@/lib/appwrite.config";
import {Databases, ID, Query} from "node-appwrite";
import {parseStringify} from "@/lib/utils";
import {InputFile} from "node-appwrite/file";

export const CreateUser = async(user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )

        return parseStringify(newUser)
    }
    catch (error: any) {
        if(error && error?.code === 409){
            const document = await users.list([
                Query.equal('email', [user.email])
            ])

            return document?.users[0]
        }
    }
}

export const getUser = async(userId: string) => {
    try {
        const user = await users.get(userId)

        return parseStringify(user)
    }
    catch(error){
        console.log(error)
    }
}

export const registerClient = async({identificationDocument, ...client} : RegisterUserParams) => {
    try {
        let file

        if(identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }

        const newClient = await databases.createDocument(
            DATABASE_ID!,
            CLIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...client
            }
        )

        return parseStringify(newClient)
    }
    catch(error) {
        console.log(error)
    }
}

export const getClient = async(userId: string) => {
    try {
        const client = await databases.listDocuments(
            DATABASE_ID!,
            CLIENT_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )

        return parseStringify(client.documents[0])
    }
    catch(error){
        console.log(error)
    }
}