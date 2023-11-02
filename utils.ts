import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import db from "./app/db";
import { v4 } from "uuid";
import { Session } from "next-auth";

export const createWorkspace = async (agenda: string, userEmail: string) => {
    // Creates a document reference with id to be assigned before adding to db
    const workspaceRef = doc(collection(db, "workspaces"));
    localStorage.setItem("workspace", workspaceRef.id);

    await setDoc(workspaceRef, {
        agenda,
        owner: userEmail,
    });

    const d = await getDoc(workspaceRef);
    return { ...d.data(), id: d.id };
};

export const makeID = () => {
    const newID = v4();
    localStorage.setItem("temporary-user", newID);

    return newID;
};

export const safeUserEmail = (session: Session | null) => {
    return session && session.user && session.user.email
        ? session.user.email
        : localStorage.getItem("temporary-user")
        ? (localStorage.getItem("temporary-user") as string)
        : makeID();
};
