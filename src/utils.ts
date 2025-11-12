import { TreeData, TreeNode } from '@react-stately/data';

export const INITIAL_ROOT_ID = 'INITIAL_ROOT_FOLDER';

export function getRootChildren(tree: TreeData<Folder>): TreeData<Folder>['items'] {
  const root: TreeNode<Folder> | undefined = tree.getItem(INITIAL_ROOT_ID);

  if (!root || !root.children) {
    return [];
  }

  return root.children;
}

// Recursive function to build a simple tree structure, excluding the parent folder
export function buildSimpleTree(tree: TreeData<Folder>['items']): Folder[] {
  return tree.map((item) => ({
    ...item.value,
    children: buildSimpleTree(item.children || []),
  }));
}

// Function to replace $code and $name in folder names
function replaceFolderNameVariables(str: string, code: string, name: string): string {
  return str.replace(/\$code/g, code).replace(/\$name/g, name);
}

type ReplaceProps = {
  folders: Folder[];
  code: string;
  name: string;
};

// Recursive function to replace folder names in the entire structure
export function replaceFolderNames({ folders, code, name }: ReplaceProps): Folder[] {
  return folders.map((folder) => ({
    ...folder,
    name: replaceFolderNameVariables(folder.name, code, name),
    childItems: replaceFolderNames({ folders: folder.children || [], code, name }),
  }));
}
