"use client";

import Circle from "./Circle";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AddIdea from "./AddIdea";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import Auth from "./Auth";
import { Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Xarrow, { Xwrapper } from "react-xarrows";

const Canvas = ({
  workspace,
  setWorkspace,
}: {
  workspace: Workspace | undefined;
  setWorkspace: any;
}) => {
  const [user, setUser] = useState<User>();
  const constraintsRef = useRef(null);
  const agendaRef = useRef(null);
  const { data: session } = useSession();

  useEffect(() => {
    session && session.user && setUser(session.user as User);
  }, [session]);

  const createWorkspace = async (agenda: string, userEmail?: string) => {
    // Creates a document reference with id to be assigned before adding to db
    const workspaceRef = doc(collection(db, "workspaces"));
    localStorage.setItem("workspace", workspaceRef.id);

    await setDoc(workspaceRef, {
      agenda,
      user: userEmail ? userEmail : "",
    });

    const d = await getDoc(workspaceRef);
    setWorkspace({ ...d.data(), id: d.id });
  };

  const editAgenda = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const agenda = e.target.value.trim();

    if (workspace === undefined) {
      createWorkspace(agenda, user && user.email);
    } else {
      console.log(workspace);
      await updateDoc(doc(db, "workspaces", workspace.id), {
        agenda,
      });
    }
  };

  return (
    <>
      <motion.div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        ref={constraintsRef}
      >
        <Xwrapper>
          <Circle
            constraintsRef={constraintsRef}
            title="Agenda"
            onChange={(e) => editAgenda(e)}
            type="textarea"
            idea={undefined}
            id="agenda"
            isAgenda
            ref={agendaRef}
          >
            {workspace && workspace.agenda}
          </Circle>

          {workspace
            ? workspace.ideas.map((values) => {
                return (
                  <>
                    <Circle
                      constraintsRef={constraintsRef}
                      title={values.name}
                      onChange={(e) => console.log("change")}
                      type="notes"
                      idea={values}
                      id={values.name.split(" ").join("_")}
                    >
                      {values.name}
                    </Circle>
                    <Xarrow
                      start={"agenda"} //can be react ref
                      end={values.name.split(" ").join("_")} //or an id
                    />
                  </>
                );
              })
            : null}
        </Xwrapper>
        <Flex
          gap="5"
          direction="row"
          style={{ position: "fixed", bottom: "30px" }}
        >
          <AddIdea workspace={workspace} />
          <Auth />
        </Flex>
      </motion.div>
    </>
  );
};

export default Canvas;
