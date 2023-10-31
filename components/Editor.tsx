import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./EditerTools";
import { Box, Heading } from "@radix-ui/themes";
import { v4 } from "uuid";
import { useSession } from "next-auth/react";

interface Props {
    data: any;
    editorRef: any;
    saveChanges: any;
    workspace: Workspace | undefined;
    created: boolean;
    setCreated: any;
    setUser: any | null | undefined;
    name: string;
}

export default function Editor({
    data,
    editorRef,
    saveChanges,
    workspace,
    created,
    setCreated,
    setUser,
    name,
}: Props) {
    const holderRef = useRef(null);
    const { data: session } = useSession();
    const makeID = () => {
        const newID = v4();
        localStorage.setItem("temporary-user", newID);
        return newID;
    };

  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (holderRef.current && workspace&& !created) {
        if(setUser) {
            setUser(session && session.user
                ? session?.user?.email
                : localStorage.getItem("temporary-user")
                ? localStorage.getItem("temporary-user")
                : makeID())
        }
        
        editorRef.current = new EditorJS({
          holder: holderRef.current,
          tools: EDITOR_TOOLS,
          data,
          placeholder: "Write your heart out...",
          onChange(api, event) {
            saveChanges();
          },
        });
        setCreated(true);
    }

  }, [holderRef, workspace]);

  return (
    <Box
      style={{
        paddingTop: "5px",
      }}
      id="notes"
      ref={holderRef}
    ></Box>
  );
}
