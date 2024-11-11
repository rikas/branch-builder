import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
  TextField,
  Form,
} from '@adobe/react-spectrum';

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (name: string) => void;
  defaultValue?: string;
};

export default function RenameDialog({
  isOpen,
  onOpenChange,
  defaultValue,
  onSubmit,
}: Props): JSX.Element {
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    onSubmit(data.name as string);
  };

  return (
    <DialogTrigger type="modal" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button variant="primary" isHidden />
      {(close) => (
        <Dialog size="M">
          <Heading>Rename folder</Heading>

          <Divider />

          <Content>
            <Form validationBehavior="native" onSubmit={submitForm}>
              <TextField
                name="name"
                label="New name"
                defaultValue={defaultValue}
                isRequired
                autoFocus
              />

              <ButtonGroup>
                <Button variant="secondary" onPress={close}>
                  Cancel
                </Button>
                <Button variant="accent" type="submit">
                  Confirm
                </Button>
              </ButtonGroup>
            </Form>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
}
