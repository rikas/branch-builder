import { ActionBar, ActionBarContainer, Item, Key, Selection, Text } from '@adobe/react-spectrum';
import Edit from '@spectrum-icons/workflow/Edit';
import Delete from '@spectrum-icons/workflow/Delete';
import FolderAdd from '@spectrum-icons/workflow/FolderAdd';
import { confirm } from '@tauri-apps/plugin-dialog';
import RenameDialog from './RenameDialog';
import { useState } from 'react';
import { SimpleTree } from './tree';

type Props = {
  selectedKeys: Selection;
  onSelectionReset: () => void;
  controllers: treeControllers;
  tree: SimpleTree<Folder>;
};

export default function FolderActions({
  selectedKeys,
  onSelectionReset,
  controllers,
  tree,
}: Props): JSX.Element {
  const [renamingFolder, setRenamingFolder] = useState<boolean>(false);

  const handleAction = async (key: Key) => {
    const ids: string[] = selectedKeys !== 'all' ? (Array.from(selectedKeys) as string[]) : [];

    if (key === 'delete') {
      const result = await confirm('Are you sure you want to delete this folder?');

      if (result) {
        controllers.onDelete({ ids });
        onSelectionReset();
      }
    }

    if (key === 'add') {
      controllers.onCreate({ index: 0, parentId: getSelectedId() });
    }

    if (key === 'rename') {
      setRenamingFolder(true);
    }
  };

  const handleRename = (name: string) => {
    controllers.onRename({ id: getSelectedId(), name });
    setRenamingFolder(false);
  };

  const getSelectedId = (): string => {
    const ids: string[] = selectedKeys !== 'all' ? (Array.from(selectedKeys) as string[]) : [];
    return ids[0];
  };

  return (
    <>
      <ActionBarContainer>
        <ActionBar
          isEmphasized
          selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
          onAction={handleAction}
          onClearSelection={onSelectionReset}
          disabledKeys={selectedKeys !== 'all' && selectedKeys.size > 1 ? ['rename', 'add'] : []}
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
        defaultValue={tree.find(getSelectedId())?.data.name}
        isOpen={renamingFolder}
        onOpenChange={setRenamingFolder}
        onSubmit={handleRename}
      />
    </>
  );
}
