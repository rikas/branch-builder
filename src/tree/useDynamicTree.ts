import { useMemo, useState } from 'react';
import { SimpleTree } from './SimpleTree';

let nextId = 0;

export function useDynamicTree<T extends SimpleTreeData>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const tree = useMemo(() => new SimpleTree<T>(data), [data]);

  const onMove: treeMoveCallback = ({ dragIds, parentId, index }) => {
    for (const id of dragIds) {
      tree.move({ id, parentId: parentId, index: index });
    }

    setData(tree.data);
  };

  const onRename: treeRenameCallback = ({ name, id }) => {
    tree.update({ id, changes: { name } as any });
    setData(tree.data);
  };

  const onCreate: treeCreateCallback = ({ parentId, index }) => {
    const data = { id: `folder-id-${nextId++}`, name: 'New folder', children: [] } as any;

    tree.create({ parentId, index, data });
    setData(tree.data);

    return data;
  };

  const onDelete: treeDeleteCallback = ({ ids }) => {
    ids.forEach((id) => tree.drop({ id }));
    setData(tree.data);
  };

  const controllers: treeControllers = { onMove, onRename, onCreate, onDelete };

  return { data, setData, controllers, tree } as const;
}
