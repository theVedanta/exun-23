import { Box } from "@radix-ui/themes";
import Canvas from "../components/Canvas";
import { doc, getDoc } from "firebase/firestore";
import db from "./db";

const getWorkspace = async (id: string | null) => {
    if (id) {
        const docSnap = await getDoc(doc(db, "workspaces", id));
        return docSnap.exists() ? (docSnap.data() as Workspace) : undefined;
    }
};

const Home = async () => {
    const id = localStorage.getItem("workspace-id");
    const workspace = await getWorkspace(id);

    return (
        <Box
            style={{ paddingLeft: "20%", height: "100vh", overflow: "hidden" }}
        >
            <Canvas workspace={workspace} />
        </Box>
    );
};

export default Home;
