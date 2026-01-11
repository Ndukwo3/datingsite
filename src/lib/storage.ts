
"use client";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { getFirebaseAppInstance } from "@/firebase";

const app = getFirebaseAppInstance();
const storage = getStorage(app);

export async function uploadFile(file: File, path: string): Promise<string> {
    const fileRef = ref(storage, `${path}/${uuidv4()}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
}
