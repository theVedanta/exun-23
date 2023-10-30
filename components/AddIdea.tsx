import {
    Button,
    Dialog,
    Flex,
    IconButton,
    Text,
    TextArea,
    TextField,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

const AddIdea = () => {
    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <IconButton
                    style={{
                        cursor: "pointer",
                    }}
                    size="4"
                    variant="soft"
                    color="gray"
                >
                    <PlusIcon />
                </IconButton>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>Create awesomeness</Dialog.Title>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Name
                        </Text>
                        <TextField.Input placeholder="Name your idea..." />
                    </label>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Description
                        </Text>
                        <TextArea placeholder="Enter some basic description..." />
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button>Save</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default AddIdea;
