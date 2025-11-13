import {
  Text,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Form,
  Heading,
  TextField,
} from '@adobe/react-spectrum';
import { createFolders, openFolder } from './disk-operations';
import { useTreeContext } from './TreeContext';
import CreateIcon from '@spectrum-icons/workflow/FolderGear';
import { buildSimpleTree, getRootChildren, replaceFolderNames } from './utils';

// This button creates the folder on disk based on a predefined structure
export default function CreateTreeButton(): React.ReactElement {
  const { treeData } = useTreeContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.currentTarget));

    const rootChildren = getRootChildren(treeData);
    const simpleTree = buildSimpleTree(rootChildren);
    const simpleTreeReplaced = replaceFolderNames({
      folders: simpleTree,
      code: formData.code as string,
      name: formData.name as string,
    });

    const parentFolder = await openFolder();

    await createFolders(parentFolder, simpleTreeReplaced);

    close();
  };

  const isDisabled = getRootChildren(treeData).length === 0;

  return (
    <DialogTrigger>
      <Button variant="cta" isDisabled={isDisabled}>
        <CreateIcon aria-label="Create folder" />
        <Text>Create folder structure</Text>
      </Button>
      {(close) => (
        <Dialog>
          <Heading>
            <Flex alignItems="center" gap="size-100">
              <Text>Replace folder names variables</Text>
            </Flex>
          </Heading>

          <Divider />

          <Content>
            <Form onSubmit={(event) => handleSubmit(event, close)} validationBehavior="native">
              <TextField name="code" label="$code" isRequired autoFocus />
              <TextField name="name" label="$name" isRequired />

              <ButtonGroup align="end">
                <Button variant="secondary" onPress={close}>
                  Cancel
                </Button>

                <Button variant="accent" type="submit">
                  Apply folder structure
                </Button>
              </ButtonGroup>
            </Form>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
}
