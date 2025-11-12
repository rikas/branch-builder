import {
  ActionGroup,
  Flex,
  Item,
  Text,
  Footer,
  Heading,
  Header,
  View,
  Divider,
  Grid,
  Key,
} from '@adobe/react-spectrum';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import FolderOpen from '@spectrum-icons/workflow/FolderOpen';
import { DynamicTree } from './DynamicTree';
import TreeItemActions from './TreeItemActions';
import { useTreeContext } from './TreeContext';
import CreateTreeButton from './CreateTreeButton';

export default function App() {
  const { treeData, resetTreeFromFile, saveTreeToFile } = useTreeContext();

  type FileAction = 'save' | 'open';

  const handleFileAction = async (key: FileAction) => {
    switch (key) {
      case 'open':
        resetTreeFromFile();
        break;
      case 'save':
        saveTreeToFile();
        break;
    }
  };

  return (
    <Grid
      flex
      height="100%"
      areas={['header', 'content', 'footer']}
      rows={['size-1250', 'auto', 'size-500']}
      gap="size-0"
    >
      <View gridArea="header" padding="size-200">
        <Header>
          <Flex direction="column">
            <Heading level={1} height={0}>
              BranchBuilder
            </Heading>
            <Heading level={4}>Version {__APP_VERSION__}</Heading>
          </Flex>
        </Header>
        <Divider size="M" />
      </View>

      <View gridArea="content" padding="size-200" marginTop="size-200">
        <Flex direction="column" height="100%" gap="size-200">
          <ActionGroup
            onAction={(key: Key) => handleFileAction(key as FileAction)}
            disabledKeys={[treeData.items.length === 0 ? 'save' : '']}
          >
            <Item key="open">
              <FolderOpen />
              <Text>Load from file</Text>
            </Item>

            <Item key="save">
              <SaveFloppy />
              <Text>Save to file</Text>
            </Item>
          </ActionGroup>

          <View
            maxHeight="size-3600"
            height="size-3600"
            overflow="auto"
            borderWidth="thin"
            borderColor="dark"
          >
            <DynamicTree />
          </View>

          <View position="absolute" bottom="size-400" left="size-0" width="100%" zIndex={2}>
            <TreeItemActions />
          </View>

          <Flex justifyContent="right">
            <CreateTreeButton />
          </Flex>
        </Flex>
      </View>

      <View gridArea="footer" paddingStart="size-200">
        <Footer>
          <Flex justifyContent="start" gap="size-10">
            <Text>&copy; {new Date().getFullYear()} Ricardo Otero</Text>
          </Flex>
        </Footer>
      </View>
    </Grid>
  );
}
