import { createContext, PropsWithChildren, useContext } from 'react';
import { loadFile, saveFile } from './disk-operations';
import { TreeState, useTreeState } from '@react-stately/tree';
import { TreeData, TreeNode, useTreeData } from '@react-stately/data';
import { INITIAL_ROOT_ID } from './utils';

export const TreeContext = createContext<TreeContextType | null>(null);

export interface TreeContextType {
  treeData: TreeData<Folder>;
  treeState: TreeState<Folder>;
  startNewTree: () => void;
  resetTreeFromFile: () => Promise<void>;
  saveTreeToFile: () => Promise<void>;
}

export function TreeContextProvider({ children }: PropsWithChildren): React.ReactElement {
  const treeData = useTreeData<Folder>({
    initialItems: [{ id: INITIAL_ROOT_ID, name: INITIAL_ROOT_ID, children: [] }],
    getKey: (item) => item.id,
    getChildren: (item) => item.children || [],
  });

  const treeState = useTreeState<Folder>({
    selectionMode: 'single',
  });

  const resetTree = () => {
    const root: TreeNode<Folder> | undefined = treeData.getItem(INITIAL_ROOT_ID);

    if (!root || !root.children) {
      return;
    }

    root.children.forEach((child) => {
      treeData.remove(child.key);
    });
  };

  const startNewTree = () => {
    resetTree();
    treeData.append(INITIAL_ROOT_ID, { id: 'FOLDER_1', name: 'New Root Folder' });
  };

  const resetTreeFromFile = async () => {
    resetTree();

    const folders = await loadFile();

    if (folders.length === 0) {
      return;
    }

    treeData.append(INITIAL_ROOT_ID, folders[0]);
  };

  const saveTreeToFile = async () => {
    saveFile(treeData);
  };

  return (
    <TreeContext.Provider
      value={{ treeState, treeData, startNewTree, resetTreeFromFile, saveTreeToFile }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export function useTreeContext(): TreeContextType {
  const context = useContext(TreeContext);

  if (!context) {
    throw new Error('useTreeContext must be used within a TreeContextProvider');
  }

  return context;
}
