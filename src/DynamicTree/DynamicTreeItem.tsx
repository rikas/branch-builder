import { Collection, TreeViewItem, TreeViewItemContent } from '@react-spectrum/tree';
import { Text } from '@adobe/react-spectrum';
import FolderIcon from '@spectrum-icons/workflow/Folder';
import { TreeData } from '@react-stately/data';

type Props = {
  name: string;
  id: string;
  items: TreeData<Folder>['items'] | null;
};

export function DynamicTreeItem({ id, name, items }: Props): React.ReactElement {
  return (
    <TreeViewItem id={id} textValue={name}>
      <TreeViewItemContent>
        <Text>{name}</Text>
        <FolderIcon />
      </TreeViewItemContent>

      <Collection items={items || []}>
        {(node) => (
          <DynamicTreeItem id={node.value.id} items={node.children} name={node.value.name} />
        )}
      </Collection>
    </TreeViewItem>
  );
}
