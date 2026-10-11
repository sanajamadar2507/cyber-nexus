import { GraphData } from "@/types/graph";

export interface TreeNode {
  id: string;
  label: string;
  depth: number;
  parentId: string | null;
  children: TreeNode[];
  isLeaf: boolean;
}

export interface TreeAnalysisResult {
  rootId: string;
  rootLabel: string;
  treeRoot: TreeNode;
  maxDepth: number;
  leafNodes: { id: string; label: string }[];
  internalNodes: { id: string; label: string }[];
  preorder: string[]; // labels
  postorder: string[]; // labels
  parentChildMap: { parent: string; child: string }[];
}

export interface BinaryTreeNode {
  id: string;
  label: string;
  left?: BinaryTreeNode;
  right?: BinaryTreeNode;
}

/**
 * Builds a rooted tree structure from an undirected graph using BFS Spanning Tree from chosen root.
 */
export function buildRootedTree(graph: GraphData, rootId?: string): TreeAnalysisResult | null {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const vMap = new Map(activeVertices.map((v) => [v.id, v]));

  if (activeVertices.length === 0) return null;

  const root = rootId && vMap.has(rootId) ? rootId : activeVertices[0].id;
  const rootVertex = vMap.get(root)!;

  const adj = new Map<string, string[]>();
  activeVertices.forEach((v) => adj.set(v.id, []));

  for (const e of activeEdges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.push(e.target);
      adj.get(e.target)!.push(e.source);
    }
  }

  // BFS to build rooted tree hierarchy
  const visited = new Set<string>([root]);
  const nodeMap = new Map<string, TreeNode>();

  const rootNode: TreeNode = {
    id: root,
    label: rootVertex.label,
    depth: 0,
    parentId: null,
    children: [],
    isLeaf: false,
  };
  nodeMap.set(root, rootNode);

  const queue: string[] = [root];
  let maxDepth = 0;
  const parentChildMap: { parent: string; child: string }[] = [];

  while (queue.length > 0) {
    const currId = queue.shift()!;
    const currNode = nodeMap.get(currId)!;

    const neighbors = adj.get(currId) || [];
    for (const nxtId of neighbors) {
      if (!visited.has(nxtId)) {
        visited.add(nxtId);
        const nxtVertex = vMap.get(nxtId)!;
        const childNode: TreeNode = {
          id: nxtId,
          label: nxtVertex.label,
          depth: currNode.depth + 1,
          parentId: currId,
          children: [],
          isLeaf: false,
        };
        maxDepth = Math.max(maxDepth, childNode.depth);
        currNode.children.push(childNode);
        nodeMap.set(nxtId, childNode);
        parentChildMap.push({ parent: currNode.label, child: nxtVertex.label });
        queue.push(nxtId);
      }
    }
  }

  const leafNodes: { id: string; label: string }[] = [];
  const internalNodes: { id: string; label: string }[] = [];

  nodeMap.forEach((node) => {
    if (node.children.length === 0) {
      node.isLeaf = true;
      leafNodes.push({ id: node.id, label: node.label });
    } else {
      internalNodes.push({ id: node.id, label: node.label });
    }
  });

  // Traversals
  const preorder: string[] = [];
  function traversePreorder(node: TreeNode) {
    preorder.push(node.label);
    for (const child of node.children) {
      traversePreorder(child);
    }
  }
  traversePreorder(rootNode);

  const postorder: string[] = [];
  function traversePostorder(node: TreeNode) {
    for (const child of node.children) {
      traversePostorder(child);
    }
    postorder.push(node.label);
  }
  traversePostorder(rootNode);

  return {
    rootId: root,
    rootLabel: rootVertex.label,
    treeRoot: rootNode,
    maxDepth,
    leafNodes,
    internalNodes,
    preorder,
    postorder,
    parentChildMap,
  };
}

/**
 * Demonstrative Binary Tree for Inorder Traversal strictly conforming to Discrete Mathematics.
 */
export function getSampleBinaryTree(): {
  root: BinaryTreeNode;
  preorder: string[];
  inorder: string[];
  postorder: string[];
} {
  // Construct a standard network binary routing hierarchy:
  //            Gateway-0
  //           /         \
  //      Router-L      Router-R
  //       /    \        /     \
  //    SW-A   SW-B   SW-C    SW-D
  const root: BinaryTreeNode = {
    id: "b1",
    label: "Root-GW",
    left: {
      id: "b2",
      label: "Spine-West",
      left: { id: "b4", label: "Leaf-A" },
      right: { id: "b5", label: "Leaf-B" },
    },
    right: {
      id: "b3",
      label: "Spine-East",
      left: { id: "b6", label: "Leaf-C" },
      right: { id: "b7", label: "Leaf-D" },
    },
  };

  const preorder: string[] = [];
  const inorder: string[] = [];
  const postorder: string[] = [];

  function pre(node?: BinaryTreeNode) {
    if (!node) return;
    preorder.push(node.label);
    pre(node.left);
    pre(node.right);
  }

  function inOrder(node?: BinaryTreeNode) {
    if (!node) return;
    inOrder(node.left);
    inorder.push(node.label);
    inOrder(node.right);
  }

  function post(node?: BinaryTreeNode) {
    if (!node) return;
    post(node.left);
    post(node.right);
    postorder.push(node.label);
  }

  pre(root);
  inOrder(root);
  post(root);

  return {
    root,
    preorder,
    inorder,
    postorder,
  };
}
