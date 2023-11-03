import Circle from "./Circle";
import React, { ChangeEvent, useRef, useState } from "react";
import { motion, useAnimationControls, useDragControls } from "framer-motion";
import AddIdea from "./AddIdea";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import Auth from "./Auth";
import { Box, Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { createWorkspace, getSafeUserEmail } from "@/utils";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import Commands from "./Commands";

const Canvas = ({
    workspace,
    getWorkspace,
}: {
    workspace: Workspace | undefined;
    getWorkspace: any;
}) => {
    const constraintsRef = useRef(null);
    const { data: session } = useSession();
    const [isCustomizeToolActive, setIsCustomizeToolActive] = useState(false);
    const [reset, setReset] = useState(false);

    const editAgenda = async (e: ChangeEvent<HTMLTextAreaElement>) => {
        const agenda = e.target.value.trim();
        const userEmail = getSafeUserEmail(session, localStorage);

        if (workspace === undefined) {
            await createWorkspace(agenda, userEmail);

            // To enable live update
            getWorkspace();
        } else {
            await updateDoc(doc(db, "workspaces", workspace.id), {
                agenda,
            });
        }
    };
    const dragControls = useDragControls();
    const animationControls = useAnimationControls();
    
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
                className="organize-wrapper"
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
                        dragControls={dragControls}
                        animationControls={animationControls}
                        isCustomizeToolActive={isCustomizeToolActive}
                    >
                        {workspace && workspace.agenda}
                    </Circle>

                    <Flex className="organize-wrapper">
                        {workspace && workspace.ideas
                            ? workspace.ideas.map((idea: Idea, i) => {
                                  return (
                                      <React.Fragment key={i}>
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
                                              dragControls={dragControls}
                                              animationControls={animationControls}
                                              isCustomizeToolActive={isCustomizeToolActive}
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
                                      </React.Fragment>
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
                    <Commands
                        workspace={workspace}
                        animationControls={animationControls}
                        setIsCustomizeToolActive={setIsCustomizeToolActive}
                        setReset={setReset}
                    />
                    <Auth />
                </Flex>
            </motion.div>
        </>
    );
};

export default Canvas;
