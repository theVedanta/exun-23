import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import db from "./app/db";

const createWorkspace = async (agenda: string, userEmail?: string) => {
    // Creates a document reference with id to be assigned before adding to db
    const workspaceRef = doc(collection(db, "workspaces"));
    localStorage.setItem("workspace", workspaceRef.id);

    await setDoc(workspaceRef, {
        agenda,
        user: userEmail ? userEmail : "",
    });

    const d = await getDoc(workspaceRef);
    return { ...d.data(), id: d.id };
};

export default createWorkspace;
