import db from "@/app/db";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";

const getData = async (email: string) => {
    let workspaces: Workspace[] = [];
    const fetchedWs = await getDocs(
        query(collection(db, "workspaces"), where("user", "==", email))
    );
    fetchedWs.forEach((d) => workspaces.push(d.data() as Workspace));

    return workspaces;
};

const Workspaces = () => {
    const { data: session } = useSession();
    const coding =
        session && session.user && getData(session?.user?.email as string);

    return <></>;
};
export default Workspaces;
