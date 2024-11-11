import {
  Text,
  ActionButton,
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

type Props = {
  data: Folder[];
  disabled: boolean;
};

export default function ApplyTreeButton({ data, disabled = false }: Props): JSX.Element {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const code = formData.code as string;
    const name = formData.name as string;

    const replace = (str: string) => str.replace(/\$code/g, code).replace(/\$name/g, name);

    const replaceInFolders = (folders: Folder[]): Folder[] =>
      folders.map((folder) => ({
        ...folder,
        name: replace(folder.name),
        children: replaceInFolders(folder.children),
      }));

    const newFolders = replaceInFolders(data);

    const parentFolder = await openFolder();

    await createFolders(parentFolder, newFolders);

    close();
  };

  return (
    <DialogTrigger>
      <ActionButton isDisabled={disabled}>Create folder structure</ActionButton>
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
