"use client";

import {
  addEdge,
  applyEdgeChanges,
  Background,
  ConnectionLineType,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type OnConnect,
  type OnConnectEnd,
  ReactFlow,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  useCreateRole,
  useDeleteRole,
  useOrganogramLayout,
  useRoles,
  useUpdateRole,
} from "./hooks";
import { nodeTypes } from "./nodes";
import { RoleDetailPanel } from "./panels";
import { saveOrganogramLayout } from "./services";
import type { RoleNode } from "./types";
import { autoLayout } from "./utils/autoLayout";

type Props = {
  readOnly: boolean;
};

type PendingDrop = {
  sourceId: string;
  position: { x: number; y: number };
  screenPosition: { x: number; y: number };
};

const EDGE_STYLE = { stroke: "var(--vita-text-muted)", strokeWidth: 2 };

export default function OrganogramCanvas({ readOnly }: Props) {
  const t = useTranslations("organogram");
  const { data: roles } = useRoles();
  const { data: layout } = useOrganogramLayout();
  const createRole = useCreateRole();
  const deleteRoleMutation = useDeleteRole();
  const updateRoleMutation = useUpdateRole();
  const reactFlowInstance = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<RoleNode>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // ── Initial sync: roles + layout → ReactFlow nodes/edges (once) ────────
  useEffect(() => {
    if (!roles || !layout) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const positions = autoLayout(roles, layout.nodes_layout, layout.edges);

    const newNodes: RoleNode[] = roles.map((role) => ({
      id: role.id,
      type: "roleNode" as const,
      position: positions[role.id] ?? { x: 0, y: 0 },
      data: { role, isReadOnly: readOnly },
    }));

    const newEdges: Edge[] = layout.edges.map((e, i) => ({
      id: `e-${e.source}-${e.target}-${i}`,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      style: EDGE_STYLE,
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [roles, layout, readOnly, setNodes]);

  // ── Update node data when roles refetch (name change, member count) ────
  useEffect(() => {
    if (!roles || !initializedRef.current) return;
    setNodes((nds) =>
      nds.map((node) => {
        const updated = roles.find((r) => r.id === node.id);
        if (!updated) return node;
        return {
          ...node,
          data: { ...node.data, role: updated },
        };
      }),
    );
  }, [roles, setNodes]);

  // ── Persist layout to backend (fire-and-forget) ────────────────────────
  const persistLayout = useCallback(() => {
    if (readOnly) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const currentNodes = reactFlowInstance.getNodes();
      const currentEdges = reactFlowInstance.getEdges();
      const nodesLayout: Record<string, { x: number; y: number }> = {};
      for (const n of currentNodes) {
        nodesLayout[n.id] = { x: n.position.x, y: n.position.y };
      }
      const edgeList = currentEdges.map((e) => ({
        source: e.source,
        target: e.target,
      }));
      saveOrganogramLayout({ nodes_layout: nodesLayout, edges: edgeList });
    }, 1000);
  }, [readOnly, reactFlowInstance]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      persistLayout();
    },
    [persistLayout],
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (readOnly) return;
      if (connectionState.isValid) return;
      if (!connectionState.fromNode) return;

      const clientX =
        "clientX" in event
          ? event.clientX
          : ((event as TouchEvent).touches?.[0]?.clientX ?? 0);
      const clientY =
        "clientY" in event
          ? event.clientY
          : ((event as TouchEvent).touches?.[0]?.clientY ?? 0);

      const flowPosition = reactFlowInstance.screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      justDroppedRef.current = true;
      setPendingDrop({
        sourceId: connectionState.fromNode.id,
        position: flowPosition,
        screenPosition: { x: clientX, y: clientY },
      });
    },
    [readOnly, reactFlowInstance],
  );

  const handleConfirmCreate = useCallback(() => {
    if (!pendingDrop) return;
    const { sourceId, position } = pendingDrop;
    setPendingDrop(null);

    createRole.mutate(
      { name: t("untitledRole") },
      {
        onSuccess: (newRole) => {
          const newNode: RoleNode = {
            id: newRole.id,
            type: "roleNode",
            position,
            data: { role: newRole, isReadOnly: readOnly },
          };
          setNodes((nds) => [...nds, newNode]);
          setEdges((eds) =>
            addEdge(
              {
                id: `e-${sourceId}-${newRole.id}`,
                source: sourceId,
                target: newRole.id,
                type: "smoothstep",
                style: EDGE_STYLE,
              },
              eds,
            ),
          );
          persistLayout();
          setSelectedRoleId(newRole.id);
        },
      },
    );
  }, [pendingDrop, readOnly, createRole, setNodes, persistLayout, t]);

  const handleCancelCreate = useCallback(() => {
    setPendingDrop(null);
  }, []);

  const onNodeDragStop = useCallback(() => {
    persistLayout();
  }, [persistLayout]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: RoleNode) => {
      setSelectedRoleId(node.id);
    },
    [],
  );

  // Dismiss popover on pane click, but not immediately after a connect end
  const justDroppedRef = useRef(false);
  const onPaneClick = useCallback(() => {
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }
    setPendingDrop(null);
  }, []);

  // ── Listen for custom events from RoleNode ─────────────────────────────
  useEffect(() => {
    const handleRename = (e: Event) => {
      const { roleId, name } = (e as CustomEvent).detail;
      updateRoleMutation.mutate({ id: roleId, name });
    };
    const handleDelete = (e: Event) => {
      const { roleId } = (e as CustomEvent).detail;
      deleteRoleMutation.mutate(roleId, {
        onSuccess: () => {
          setNodes((nds) => nds.filter((n) => n.id !== roleId));
          setEdges((eds) =>
            eds.filter((e) => e.source !== roleId && e.target !== roleId),
          );
          if (selectedRoleId === roleId) setSelectedRoleId(null);
          persistLayout();
        },
      });
    };

    window.addEventListener("organogram:rename-role", handleRename);
    window.addEventListener("organogram:delete-role", handleDelete);
    return () => {
      window.removeEventListener("organogram:rename-role", handleRename);
      window.removeEventListener("organogram:delete-role", handleDelete);
    };
  }, [
    updateRoleMutation,
    deleteRoleMutation,
    setNodes,
    selectedRoleId,
    persistLayout,
  ]);

  // ── Cleanup save timeout on unmount ────────────────────────────────────
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onConnectEnd={readOnly ? undefined : onConnectEnd}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable
        defaultEdgeOptions={{ type: "smoothstep", style: EDGE_STYLE }}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionRadius={40}
        zoomOnScroll
        minZoom={0.2}
        maxZoom={2}
      >
        <Background
          gap={20}
          size={1}
          style={{ background: "var(--vita-background)" }}
        />
        <Controls
          showInteractive={!readOnly}
          style={{
            background: "var(--vita-surface)",
            border: "1px solid var(--vita-border)",
            borderRadius: 8,
          }}
        />
        <MiniMap
          style={{
            background: "var(--vita-surface)",
            border: "1px solid var(--vita-border)",
            borderRadius: 8,
          }}
          nodeColor="var(--vita-primary)"
          maskColor="rgba(0,0,0,0.1)"
        />
      </ReactFlow>

      {/* Create role popover — appears where the user dropped the connection */}
      {pendingDrop && (
        <div
          style={{
            position: "fixed",
            top: pendingDrop.screenPosition.y - 20,
            left: pendingDrop.screenPosition.x + 10,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid var(--vita-border)",
            background: "var(--vita-surface)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            animation: "fadeIn 120ms ease-out",
          }}
        >
          <button
            type="button"
            onClick={handleConfirmCreate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: "var(--vita-primary)",
              color: "var(--vita-primary-foreground, #fff)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Plus size={14} />
            {t("createRole")}
          </button>
          <button
            type="button"
            onClick={handleCancelCreate}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid var(--vita-border)",
              background: "transparent",
              color: "var(--vita-text-muted)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {t("cancel")}
          </button>
        </div>
      )}

      {/* Detail panel */}
      {selectedRoleId && (
        <RoleDetailPanel
          roleId={selectedRoleId}
          isReadOnly={readOnly}
          onClose={() => setSelectedRoleId(null)}
        />
      )}
    </div>
  );
}
