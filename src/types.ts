interface Folder {
  name: string;
  id: string;
  children: Folder[];
}

type SimpleTreeData = {
  id: string;
  name: string;
  children?: SimpleTreeData[];
};

type treeMoveCallback = ({
  dragIds,
  parentId,
  index,
}: {
  dragIds: string[];
  parentId: null | string;
  index: number;
}) => void;

type treeRenameCallback = ({ name, id }: { name: string; id: string }) => void;
type treeCreateCallback = ({ parentId, index }: { parentId: string; index: number }) => void;
type treeDeleteCallback = ({ ids }: { ids: string[] }) => void;

type treeControllers = {
  onRename: treeRenameCallback;
  onMove: treeMoveCallback;
  onCreate: treeCreateCallback;
  onDelete: treeDeleteCallback;
};
