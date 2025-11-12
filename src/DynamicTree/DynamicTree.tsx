import { TreeView } from '@react-spectrum/tree';
import { DynamicTreeItem } from './DynamicTreeItem';
import { DynamicTreeEmptyState } from './DynamicTreeEmptyState';
import { ToastQueue } from '@react-spectrum/toast';
import { useTreeContext } from '../TreeContext';
import { INITIAL_ROOT_ID } from '../utils';

export function DynamicTree(): React.ReactElement {
  const { treeData, treeState, startNewTree, resetTreeFromFile } = useTreeContext();

  const handleStartNewTree = () => {
    startNewTree();
    ToastQueue.positive('New directory tree created', { timeout: 2000 });
  };

  const handleLoadTree = () => {
    resetTreeFromFile();
  };

  const rootItem = treeData.getItem(INITIAL_ROOT_ID);
  const treeItems = rootItem?.children || [];

  return (
    <>
      <TreeView
        items={treeItems}
        aria-label="Tree view with folders"
        selectionMode={treeState.selectionManager.selectionMode}
        expandedKeys={treeState.expandedKeys}
        onExpandedChange={treeState.setExpandedKeys}
        selectedKeys={treeData.selectedKeys}
        selectionStyle="highlight"
        renderEmptyState={() => (
          <DynamicTreeEmptyState
            onStartPressed={handleStartNewTree}
            onLoadPressed={handleLoadTree}
          />
        )}
        onSelectionChange={(keys) => {
          if (keys !== 'all') {
            treeData.setSelectedKeys(keys);
          }
        }}
      >
        {(node) => (
          <DynamicTreeItem id={node.value.id} name={node.value.name} items={node.children} />
        )}
      </TreeView>
      <button onClick={handleStartNewTree}>NEW</button>
    </>
  );
}
