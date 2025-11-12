import { ActionBar, ActionBarContainer, Item, Key, Text, TreeData } from '@adobe/react-spectrum';
import Edit from '@spectrum-icons/workflow/Edit';
import Delete from '@spectrum-icons/workflow/Delete';
import FolderAdd from '@spectrum-icons/workflow/FolderAdd';
import { confirm } from '@tauri-apps/plugin-dialog';
import RenameDialog from './RenameDialog';
import { useMemo, useState } from 'react';
import { useTreeContext } from './TreeContext';

let nextId = 0;

export default function TreeItemActions(): React.ReactElement {
  const { treeData, treeState } = useTreeContext();
  const [renamingFolder, setRenamingFolder] = useState<boolean>(false);

  const selectedItem = useMemo((): TreeData<Folder>['items'][0] | undefined => {
    const [first] = treeData.selectedKeys;

    if (first) {
      return treeData.getItem(first);
    }
  }, [treeData.selectedKeys]);

  const handleAction = async (key: Key) => {
    if (key === 'delete') {
      const result = await confirm('Are you sure you want to delete this folder?');

      if (result) {
        const [first] = treeData.selectedKeys;

        if (first) {
          treeData.remove(first);
        }
      }
    }

    if (key === 'add') {
      const [first] = treeData.selectedKeys;

      if (first) {
        treeData.append(first, {
          id: `folder-id-${nextId++}`,
          name: 'New directory',
        });

        const newExpandedKeys = new Set(treeState.expandedKeys);
        newExpandedKeys.add(first);
        treeState.setExpandedKeys(newExpandedKeys);
      }
    }

    if (key === 'rename') {
      setRenamingFolder(true);
    }
  };

  const handleRename = (name: string) => {
    const [first] = treeData.selectedKeys;
    const selectedItem = treeData.getItem(first);

    if (selectedItem) {
      const currentChildrenData = selectedItem.children
        ? selectedItem.children.map((node) => node.value)
        : [];

      treeData.update(selectedItem.key, {
        ...selectedItem.value,
        name,
        children: currentChildrenData,
      });
    }

    treeData.setSelectedKeys(new Set());
    setRenamingFolder(false);
  };

  // const getSelectedItem = (): undefined | TreeNode<Folder> => {
  //   const selectedKeys = tree.selectedKeys;
  //
  //   if (selectedKeys.size === 0) {
  //     throw new Error('No item selected');
  //   }
  //
  //   return tree.getItem(selectedKeys.values().next().value as Key);
  // };

  return (
    <>
      <ActionBarContainer>
        <ActionBar
          isEmphasized
          selectedItemCount={treeData.selectedKeys.size}
          onAction={handleAction}
          onClearSelection={() => treeData.setSelectedKeys(new Set())}
          disabledKeys={treeData.selectedKeys.size > 1 ? ['rename', 'add'] : []}
        >
          <Item key="rename">
            <Edit />
            <Text>Rename</Text>
          </Item>

          <Item key="add">
            <FolderAdd />
            <Text>Add child</Text>
          </Item>

          <Item key="delete">
            <Delete />
            <Text>Delete</Text>
          </Item>
        </ActionBar>
      </ActionBarContainer>

      <RenameDialog
        defaultValue={selectedItem?.value.name || ''}
        isOpen={renamingFolder}
        onOpenChange={setRenamingFolder}
        onSubmit={handleRename}
      />
    </>
  );
}
