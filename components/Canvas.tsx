"use client";

import Circle from "./Circle";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AddIdea from "./AddIdea";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import Auth from "./Auth";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import createWorkspace from "@/utils";
import Xarrow, { Xwrapper } from "react-xarrows";
import Commands from "./Commands";
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const Canvas = ({
    workspace,
    setWorkspace,
}: {
    workspace: Workspace | undefined;
    setWorkspace: any;
}) => {
    const [user, setUser] = useState<User>();
    const constraintsRef = useRef(null);
    const { data: session } = useSession();
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');

    useEffect(() => {
        session && session.user && setUser(session.user as User);
    }, [session]);

    const editAgenda = async (e: ChangeEvent<HTMLTextAreaElement>) => {
        const agenda = e.target.value.trim();

        if (workspace === undefined) {
            const ws = await createWorkspace(agenda, user && user.email);
            setWorkspace(ws);
        } else {
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
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                ref={constraintsRef}
            >
                <Xwrapper>
                    <Circle
                        workspace={workspace}
                        constraintsRef={constraintsRef}
                        title="Agenda"
                        onChange={(e) => editAgenda(e)}
                        type="textarea"
                        idea={undefined}
                        id="agenda"
                        isAgenda
                    >
                        {workspace && workspace.agenda}
                    </Circle>

                    <Flex>
                        {workspace && workspace.ideas
                            ? workspace.ideas.map((idea: Idea) => {
                                  return (
                                      <>
                                          <Circle
                                              constraintsRef={constraintsRef}
                                              title={idea.name}
                                              onChange={(e) =>
                                                  console.log("change")
                                              }
                                              type="notes"
                                              idea={idea}
                                              id={idea.id}
                                              workspace={workspace}
                                          >
                                              {idea.name}
                                          </Circle>

                                          <Xarrow
                                              start="agenda" //can be react ref
                                              end={idea.id} //or an id
                                              color="#6a80d9"
                                              headSize={0}
                                              strokeWidth={2}
                                              curveness={0.6}
                                          />
                                      </>
                                  );
                              })
                            : null}
                    </Flex>
                </Xwrapper>
                <Flex
                    gap="5"
                    direction="row"
                    style={{ position: "fixed", bottom: "30px" }}
                >
                    <AddIdea workspace={workspace} />
                    <Commands setOpenAlert={setOpenAlert} setAlertContent={setAlertContent} workspace={workspace} />
                    <Auth />
                </Flex>
        		<CustomDialog open={openAlert} setOpenAlert={setOpenAlert}  alertContent={alertContent} />
                        
            </motion.div>
        </>
    );
};


const CustomDialog = ({open, alertContent,setOpenAlert}: {open: boolean, alertContent:string, setOpenAlert:any}) => {
	return <Dialog.Root open={open}>
            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>Summary</Dialog.Title>
                {alertContent}
                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray" onClick={()=> setOpenAlert(false)}>
                            Cancel
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
}


export default Canvas;
