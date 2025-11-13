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
    <Flex height="100%" gap="size-25" direction="column">
      <View padding="size-200">
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

      <View flexGrow={1} height="auto" padding="size-200">
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

          <Flex height="100%" width="100%">
            <View width="100%" overflow="auto" borderWidth="thin" borderColor="dark">
              <DynamicTree />
            </View>
          </Flex>

          <View position="absolute" bottom="size-0" left="size-0" width="100%" zIndex={2}>
            <TreeItemActions />
          </View>

          <Flex justifyContent="right">
            <CreateTreeButton />
          </Flex>
        </Flex>
      </View>

      <View gridArea="footer" paddingStart="size-200" paddingBottom="size-200">
        <Footer>
          <Flex justifyContent="start" gap="size-10">
            <Text>&copy; {new Date().getFullYear()} Ricardo Otero</Text>
          </Flex>
        </Footer>
      </View>
    </Flex>
  );
}
