import { useState } from 'react';
import {
  ActionGroup,
  Flex,
  Item,
  Text,
  Selection,
  Footer,
  Heading,
  Header,
  View,
  Divider,
  Grid,
  Key,
  IllustratedMessage,
  Content,
  Link,
} from '@adobe/react-spectrum';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import FolderOpen from '@spectrum-icons/workflow/FolderOpen';
import FolderIcon from '@spectrum-icons/workflow/Folder';
import { TreeView, TreeViewItem } from '@react-spectrum/tree';
import FolderActions from './FolderActions';
import { useDynamicTree } from './tree';
import EmptyStateIllustration from './EmptyStateIllustration';
import { openFile, saveFile } from './disk-operations';
import ApplyTreeButton from './ApplyTreeButton';

export default function App() {
  const { setData, data, controllers, tree } = useDynamicTree<Folder>([]);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  type TreeAction = 'save' | 'create' | 'open';

  const handleTreeAction = async (key: TreeAction) => {
    switch (key) {
      case 'create':
        setData([{ id: 'root', name: 'root', children: [] }]);
        break;
      case 'open':
        const folders = await openFile();
        setData(folders);
        break;
      case 'save':
        saveFile(data);
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
            <Heading level={4}>Version 0.1</Heading>
          </Flex>
        </Header>
        <Divider size="L" />
      </View>

      <View gridArea="content" padding="size-200" marginTop="size-200">
        <Flex direction="column" height="100%" gap="size-200">
          <ActionGroup
            onAction={(key: Key) => handleTreeAction(key as TreeAction)}
            disabledKeys={[!!data && 'save']}
          >
            <Item key="open">
              <FolderOpen />
              <Text>Open</Text>
            </Item>

            <Item key="save">
              <SaveFloppy />
              <Text>Save</Text>
            </Item>
          </ActionGroup>

          <View
            maxHeight="size-3600"
            height="size-3600"
            overflow="auto"
            borderWidth="thin"
            borderColor="dark"
          >
            {(!data || data.length === 0) && (
              <IllustratedMessage>
                <EmptyStateIllustration />
                <Heading>No folder structure loaded</Heading>
                <Content>
                  Start by{' '}
                  <Link onPress={() => handleTreeAction('create')}>creating a new structure</Link>{' '}
                  or{' '}
                  <Link onPress={() => handleTreeAction('open')}>
                    open an existing configuration
                  </Link>
                  .
                </Content>
              </IllustratedMessage>
            )}

            {data && data.length > 0 && (
              <TreeView
                items={data}
                aria-label="Tree view with folders"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
              >
                {(item: Folder) => (
                  <TreeViewItem childItems={item.children} textValue={item.name}>
                    <FolderIcon />
                    <Text>{item.name}</Text>
                  </TreeViewItem>
                )}
              </TreeView>
            )}
          </View>

          <View position="absolute" bottom="size-400" left="size-0" width="100%" zIndex={2}>
            <FolderActions
              tree={tree}
              selectedKeys={selectedKeys}
              onSelectionReset={() => setSelectedKeys(new Set())}
              controllers={controllers}
            />
          </View>

          <Flex justifyContent="right">
            <ApplyTreeButton data={data} disabled={!data || data.length === 0} />
          </Flex>
        </Flex>
      </View>

      <View gridArea="footer" paddingStart="size-200">
        <Footer>&copy; {new Date().getFullYear()} Ricardo Otero</Footer>
      </View>
    </Grid>
  );
}
