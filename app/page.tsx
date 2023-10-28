"use client";

import { Button } from "@radix-ui/themes";
import { signIn } from "next-auth/react";

const Home = () => {
    return (
        <div>
            <Button onClick={() => signIn()}>Hello World</Button>
        </div>
    );
};

export default Home;
